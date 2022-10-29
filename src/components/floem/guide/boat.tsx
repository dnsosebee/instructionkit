import { Map } from 'immutable'
import { isArray } from 'lodash'
import { HTMLElement, NodeType, parse } from 'node-html-parser'
import { logger as parentLogger } from '../../../logger'
import { DataDart } from '../../../model/core/dart'
import { DataFloem } from '../../../model/core/floem'
import { DataFlow } from '../../../model/core/flow'
import { Booty, Flocation, GuideStep } from './guide'

const logger = parentLogger.child({ module: 'boat' })

export async function riverStoneAt(
  floem: DataFloem,
  flowFrom: Flocation,
  vars: Booty,
): Promise<GuideStep> {
  logger.debug('riverStoneAt: ', floem, flowFrom, vars)
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
  logger.debug(el)

  // booty injections
  if (el.tagName !== 'PRE') {
    el.innerHTML = el.innerHTML.replaceAll(/{ *([A-z_]+[A-z_0-9]*) *}/g, (match, bootyName) => {
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
  } else if (el.rawTagName === 'switch') {
    if (el.attributes['type'])
      // TODO
      return choiceStone({
        fragment,
        vars,
        flowFrom,
        content: el.innerHTML,
      })
  } else if (el.tagName === 'PRE') {
    const flogram = el.innerText
      .slice('<code>'.length, -'</code>'.length)
      .replaceAll(/&lt;/g, '<')
      .replaceAll(/&gt;/g, '>')
    const varsObject = vars.toObject()
    const message = { flogram, vars: varsObject }
    const worker = new Worker('/flogram.js')
    worker.postMessage(message)
    const updatedVars = await (async () => {
      logger.debug('waiting for flogram')
      return new Promise<Booty>(resolve => {
        worker.onmessage = e => {
          worker.terminate()
          // let updatedVars: Booty = Map<string, any>() TODO: Figure out why this line doesn't work. Old booty variables are not getting passed back in the vars object from the webworker.
          let updatedVars: Booty = Map<string, any>(varsObject)
          e.data.forEach(([k, v]: [k: string, v: any]) => {
            updatedVars = updatedVars.set(k, v)
          })
          logger.debug('flogram done, ', e.data)
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
  content,
}: {
  fragment: HTMLElement[]
  vars: Booty
  flowFrom: Flocation
  content: string
}): GuideStep => ({
  booty: vars,
  step: {
    ui: {
      fragment: fragmentString(fragment),
      advancer: {
        type: 'choice',
        params: {
          content,
        },
      },
    },
    consequences: {
      assignTo: 'output',
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
