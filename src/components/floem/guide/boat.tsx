import { Map } from 'immutable'
import { isArray, trim } from 'lodash'
import { HTMLElement, NodeType, parse } from 'node-html-parser'
import { FlogramWorker } from '../../../flogram'
import { logger as parentLogger } from '../../../logger'
import { DataDart } from '../../../model/core/dart'
import { DataFloem } from '../../../model/core/floem'
import { DataFlow } from '../../../model/core/flow'
import { Booty, Flocation, GuideStep } from './guide'

const logger = parentLogger.child({ file: 'boat.tsx' })

export async function riverStoneAt(
  floem: DataFloem,
  flowFrom: Flocation,
  vars: Booty,
): Promise<GuideStep> {
  return helper({
    flows: floem.flows,
    darts: floem.darts,
    flocation: flowFrom,
    flowNodes: refill(floem.flows, flowFrom.flow),
    fragment: [],
    vars,
  })
}

const refill = (flows: DataFlow[], id: DataFlow['id']): HTMLElement[] => {
  const flow = flows.find(f => f.id === id)!
  const body = parse(flow.flowtext)
  const childElements = body.childNodes.filter(
    c => c.nodeType === NodeType.ELEMENT_NODE,
  ) as HTMLElement[] // redundant probably
  return Array.from(childElements)
}

const helper = async (data: {
  flows: DataFlow[]
  darts: DataDart[]
  flocation: Flocation
  flowNodes: HTMLElement[] // nodes of the current flow
  fragment: HTMLElement[] // recursively builds up the fragment
  vars: Booty
}): Promise<GuideStep> => {
  const { flows, darts, flocation, flowNodes, fragment, vars } = data
  const doneWithFlow = flocation.node >= flowNodes.length
  if (doneWithFlow) {
    const branches = darts.filter(v => v.from == flocation.flow)
    const noValidNextFlow = branches.length === 0
    if (noValidNextFlow) {
      return finishStone({ fragment, vars, flowFrom: flocation })
    }
    const dart = branches.find(v => v.case === vars.get('output')) || branches[0]
    const nextFlocation: Flocation = { flow: dart.to, node: 0 }
    const nextFlowNodes = refill(flows, nextFlocation.flow)
    return helper({
      flows,
      darts,
      flocation: nextFlocation,
      flowNodes: nextFlowNodes,
      fragment: data.fragment,
      vars,
    })
  }

  const flowFrom: Flocation = { flow: flocation.flow, node: flocation.node + 1 }
  const el = flowNodes[flocation.node]
  let match

  // booty injections
  if (el.tagName !== 'PRE') {
    el.innerHTML = el.innerHTML.replace(/{ *([A-z_]+[A-z_0-9]*) *}/, (match, bootyName) => {
      const bootyValue = vars.get(bootyName)

      if (bootyValue === undefined) return 'UNDEFINED'

      if (isArray(bootyValue)) return bootyValue.map(v => v.toString()).join(', ')

      return bootyValue.toString()
    })
  }

  if (el.tagName === 'HR') {
    return pauseStone({
      fragment,
      vars,
      flowFrom,
      newRiffle: true,
    })
  } else if (el.tagName === 'P' && (match = el.rawText?.match(/^(\.\.\.)|…$/))) {
    return pauseStone({
      fragment,
      vars,
      flowFrom,
      newRiffle: false,
    })
  } else if (
    el.tagName === 'P' &&
    (match = el.rawText?.match(
      /(?:^|\n)(?:(?<assignTo>[A-z_]+[A-z0-9_]*) *=)? *&lt;(?<defaultString>[^<>\n]*)&gt; *$/,
    ))
  ) {
    const assignTo = match.groups!.assignTo || 'output'
    const defaultString = match.groups!.defaultString || ''
    return stringStone({
      fragment,
      vars,
      flowFrom,
      assignTo,
      defaultString,
    })
  } else if (
    el.tagName === 'P' &&
    (match = el.rawText?.match(
      /(?:^|\n)(?:(?<assignTo>[A-z_]+[A-z0-9_]*) *=)? *\[ *(?<choices>(?:(?:[A-z0-9_!?*'"()^$.]+[A-z0-9_!?*'"()^$ .]*)(?:(?:, *)|(?= *\]))){2,})\](?=$|\n)/,
    ))
  ) {
    const assignTo = match.groups!.assignTo || 'output'
    const choices = match.groups!.choices.split(',').map(trim)
    return choiceStone({
      fragment,
      vars,
      flowFrom,
      choices,
      assignTo,
    })
  } else if (el.tagName === 'PRE') {
    const flogram = el.innerText.slice('<code>'.length, -'</code>'.length)
    const varsObject = vars.toObject()
    const message = { flogram, vars: varsObject }
    const worker: FlogramWorker = new Worker(new URL('src/flogram.ts', import.meta.url))
    worker.postMessage(message)
    const updatedVars = await (async () => {
      logger.debug('waiting for flogram')
      return new Promise<Booty>(resolve => {
        worker.onmessage = e => {
          logger.debug('flogram result', e.data)
          worker.terminate()
          let updatedVars: Booty = Map<string, any>()
          e.data.forEach(([k, v]: [k: string, v: any]) => {
            updatedVars = updatedVars.set(k, v)
          })
          resolve(updatedVars)
        }
      })
    })()

    return helper({
      flows,
      darts,
      flocation: flowFrom,
      flowNodes,
      fragment,
      vars: updatedVars,
    })
  }

  fragment.push(el)
  return helper({
    flows,
    darts,
    flocation: flowFrom,
    flowNodes,
    fragment,
    vars,
  })
}

const fragmentString = (fragment: HTMLElement[]): string => {
  return fragment.map(v => v.toString()).join('')
}

const finishStone = ({
  fragment,
  vars,
  flowFrom,
}: {
  fragment: HTMLElement[]
  vars: Booty
  flowFrom: Flocation
}): GuideStep => ({
  booty: vars,
  step: {
    ui: {
      fragment: fragmentString(fragment),
      advancer: {
        type: 'finish',
        params: null,
      },
    },
    consequences: {
      assignTo: null,
      flowFrom,
      newPage: true,
    },
    value: null,
  },
})

const pauseStone = ({
  fragment,
  vars,
  flowFrom,
  newRiffle,
}: {
  fragment: HTMLElement[]
  vars: Booty
  flowFrom: Flocation
  newRiffle?: boolean
}): GuideStep => ({
  booty: vars,
  step: {
    ui: {
      fragment: fragmentString(fragment),
      advancer: {
        type: 'pause',
        params: {
          text: 'Next',
        },
      },
    },
    consequences: {
      assignTo: null,
      flowFrom,
      newPage: newRiffle || false,
    },
    value: null,
  },
})

const choiceStone = ({
  fragment,
  vars,
  flowFrom,
  choices,
  assignTo,
}: {
  fragment: HTMLElement[]
  vars: Booty
  flowFrom: Flocation
  choices: string[]
  assignTo: string
}): GuideStep => ({
  booty: vars,
  step: {
    ui: {
      fragment: fragmentString(fragment),
      advancer: {
        type: 'choice',
        params: {
          choices,
        },
      },
    },
    consequences: {
      assignTo,
      flowFrom,
      newPage: false,
    },
    value: null,
  },
})

const stringStone = ({
  fragment,
  vars,
  flowFrom,
  assignTo,
  defaultString,
}: {
  fragment: HTMLElement[]
  vars: Booty
  flowFrom: Flocation
  assignTo: string
  defaultString: string
}): GuideStep => ({
  booty: vars,
  step: {
    ui: {
      fragment: fragmentString(fragment),
      advancer: {
        type: 'string',
        params: { defaultString },
      },
    },
    consequences: {
      assignTo,
      flowFrom,
      newPage: false,
    },
    value: null,
  },
})
