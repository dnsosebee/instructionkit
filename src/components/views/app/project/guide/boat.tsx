import { get, isArray } from 'lodash'
import { HTMLElement, NodeType, parse } from 'node-html-parser'
import { logger as parentLogger } from '../../../../../lib/logger'
import {
  evalAssignments,
  evalCondition,
} from '../../../../../model/postProcess/flowtext/flogramming/flogramming'
import { DEFAULT_CASE_ID } from '../../../../../model/postProcess/flowtext/nodes/flowtextExtension'
import { SwitchType } from '../../../../../model/postProcess/flowtext/nodes/switchNode'
import { Dart } from '../../../../../model/schema/types/dart/dart'
import { Flow } from '../../../../../model/schema/types/flow/flow'
import { BRANCH_FLOW_TYPE } from '../../../../../model/schema/types/flow/types/branch'
import { START_FLOW_TYPE } from '../../../../../model/schema/types/flow/types/start'

import { Booty, Flocation, GuideStep } from './guide'

const logger = parentLogger.child({ module: 'boat' })

function decodeHtml(html: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

export async function riverStoneAt(
  flows: Flow[],
  darts: Dart[],
  flowFrom: Flocation,
  vars: Booty,
  chosenCaseId: string = DEFAULT_CASE_ID,
): Promise<GuideStep> {
  logger.debug('riverStoneAt: ', flows, darts, flowFrom, vars)
  return helper({
    flows,
    darts,
    flocation: flowFrom,
    flowNodes: refill(flows, flowFrom.flow),
    fragment: [],
    vars,
    chosenCaseId,
  })
}

const refill = (flows: Flow[], id: Flow['id']): HTMLElement[] => {
  const flow = flows.find(f => f.id === id)!
  switch (flow.type) {
    case START_FLOW_TYPE:
      return []
    case BRANCH_FLOW_TYPE:
      return Array.from(
        parse(flow.flowtext).childNodes.filter(
          v => v.nodeType === NodeType.ELEMENT_NODE,
        ) as HTMLElement[],
      )
    default:
      throw new Error(`refill: unexpected flow type ${flow.type}`)
  }
}

const helper = async (data: {
  flows: Flow[]
  darts: Dart[]
  flocation: Flocation
  flowNodes: HTMLElement[] // nodes of the current flow
  fragment: HTMLElement[] // recursively builds up the fragment
  vars: Booty
  chosenCaseId: string // caseId
}): Promise<GuideStep> => {
  const { flows, darts, flocation, flowNodes, fragment, vars, chosenCaseId } = data
  const doneWithFlow = flocation.node >= flowNodes.length
  if (doneWithFlow) {
    const branches = darts.filter(v => v.from == flocation.flow)
    const dart = branches.find(v => v.case === chosenCaseId)
    if (!dart) {
      return finishStone({ fragment, vars, flowFrom: flocation })
    }
    const nextFlocation: Flocation = { flow: dart.to, node: 0 }
    const nextFlowNodes = refill(flows, nextFlocation.flow)
    const nextChosenCaseId = DEFAULT_CASE_ID
    return helper({
      flows,
      darts,
      flocation: nextFlocation,
      flowNodes: nextFlowNodes,
      fragment: data.fragment,
      vars,
      chosenCaseId: nextChosenCaseId,
    })
  }

  const flowFrom: Flocation = { flow: flocation.flow, node: flocation.node + 1 }
  const el = flowNodes[flocation.node]
  let match

  // injections
  if (el.tagName !== 'PRE') {
    // booty injections
    el.innerHTML = el.innerHTML.replaceAll(
      /{ *((?:(?:[A-z_]+[A-z_0-9]*)\.?)+) *}/g,
      (match, bootyName) => {
        const booty = vars.toJS()
        const bootyValue = get(booty, bootyName)

        if (bootyValue === undefined) return 'UNDEFINED'
        if (bootyValue === null) return 'NULL'

        if (isArray(bootyValue)) return bootyValue.map(v => v.toString()).join(', ')

        return bootyValue.toString()
      },
    )

    // link injections
    el.innerHTML = el.innerHTML.replaceAll(
      /\[(.+)\]\(((?:http(?:s)?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*))\)/g,
      (match, text, url) => `<a href="${url}" target="_blank">${text}</a>`,
    )
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
    const assignTo = match.groups!.assignTo || 'input'
    const defaultString = match.groups!.defaultString || ''
    return stringStone({
      fragment,
      vars,
      flowFrom,
      assignTo,
      defaultString,
    })
  } else if (el.rawTagName === 'switch') {
    if (el.attributes['data-switchtype'] === SwitchType.Button) {
      const assignee = (el.childNodes as HTMLElement[]).find(v => v.rawTagName === 'assignee')
      const assignTo = assignee?.rawText || 'choice'
      return choiceStone({
        fragment,
        vars,
        flowFrom,
        content: el.innerHTML,
        assignTo,
      })
    } else {
      const conditions = el.childNodes as HTMLElement[]
      let caseId = DEFAULT_CASE_ID
      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i]
        const conditionId = condition.attributes['data-id']
        const conditionText = condition.innerHTML

        const conditionResult = await evalCondition(conditionText, vars)
        if (conditionResult) {
          caseId = conditionId
          break
        }
      }
      return helper({
        flows,
        darts,
        flocation: flowFrom,
        flowNodes,
        fragment,
        vars,
        chosenCaseId: caseId,
      })
    }
  } else if (el.tagName === 'PRE') {
    if (el.innerText.startsWith('<code class="language-css">')) {
      const css = decodeHtml(
        el.innerText.slice('<code class="language-css">'.length, -'</code>'.length),
      )
      fragment.push(parse(`<style>${css}</style>`))
      return helper({
        flows,
        darts,
        flocation: flowFrom,
        flowNodes,
        fragment,
        vars,
        chosenCaseId,
      })
    } else {
      const flogram = decodeHtml(el.innerText.slice('<code>'.length, -'</code>'.length))
      const updatedVars = await evalAssignments(flogram, vars)
      return helper({
        flows,
        darts,
        flocation: flowFrom,
        flowNodes,
        fragment,
        vars: updatedVars,
        chosenCaseId,
      })
    }
  }

  fragment.push(el)
  return helper({
    flows,
    darts,
    flocation: flowFrom,
    flowNodes,
    fragment,
    vars,
    chosenCaseId,
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
  assignTo,
}: {
  fragment: HTMLElement[]
  vars: Booty
  flowFrom: Flocation
  content: string
  assignTo: string
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
