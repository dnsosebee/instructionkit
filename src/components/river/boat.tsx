import { trim } from 'lodash'
import { HTMLElement, NodeType, parse } from 'node-html-parser'
import { DataDart, DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Flocation, RiverStone, VarMap } from './river'

export function riverStoneAt(floem: DataFloem, flowFrom: Flocation, vars: VarMap): RiverStone {
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

const helper = (data: {
  flows: DataFlow[]
  darts: DataDart[]
  flocation: Flocation
  flowNodes: HTMLElement[] // nodes of the current flow
  fragment: HTMLElement[] // recursively builds up the fragment
  vars: VarMap
}): RiverStone => {
  const { flows, darts, flocation, vars, flowNodes, fragment } = data
  const doneWithNode = flocation.node >= flowNodes.length
  if (doneWithNode) {
    const branches = darts.filter(v => v.from == flocation.flow)
    const noValidNextFlow = branches.length === 0
    if (noValidNextFlow) {
      return finishStone({ fragment, vars, flowFrom: flocation })
    }
    const dart = branches[0] // TODO chooise a dart based on flogic
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
      /(?<=^|\n)(?:(?<assignment>[A-z_]+[A-z0-9_]*) *=)? *\[ *(?<choices>(?:(?:(?:(?:[A-z0-9_!?*'"()^$.]+[A-z0-9_!?*'"()^$ .]*)(?:(?:, *)|(?= *\])))){2,}))\](?=$|\n)/,
    ))
  ) {
    const choices = match.groups!.choices.split(',').map(trim)
    const assignTo = match.groups!.assignment
    return choiceStone({
      fragment,
      vars,
      flowFrom,
      choices,
      assignTo,
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
  vars: VarMap
  flowFrom: Flocation
}): RiverStone => ({
  vars,
  stone: {
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
      newRiffle: true,
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
  vars: VarMap
  flowFrom: Flocation
  newRiffle?: boolean
}): RiverStone => ({
  vars,
  stone: {
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
      newRiffle: newRiffle || false,
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
  vars: VarMap
  flowFrom: Flocation
  choices: string[]
  assignTo: string
}): RiverStone => ({
  vars,
  stone: {
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
      newRiffle: false,
    },
    value: null,
  },
})
