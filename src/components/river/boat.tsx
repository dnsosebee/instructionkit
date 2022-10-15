import { trim } from 'lodash'
import { HTMLElement, NodeType, parse } from 'node-html-parser'
import { DataDart, DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { NextButton } from './gaps'
import { FlowState, StoneType } from './river'

interface FullFlowState extends FlowState {
  flowNodes: HTMLElement[]
}

export function stoneAt(floem: DataFloem, flowState: FlowState): StoneType {
  return helper(
    floem.flows,
    floem.darts,
    { ...flowState, flowNodes: refill(floem.flows, flowState.flocation.flow) },
    [],
  )
}

const toJsx = (elements: HTMLElement[]) => (
  <div dangerouslySetInnerHTML={{ __html: elements.map(e => e.toString()).join('') }} />
)

const refill = (flows: DataFlow[], id: DataFlow['id']): HTMLElement[] => {
  const flow = flows.find(f => f.id === id)!
  const body = parse(flow.flowtext)
  const childElements = body.childNodes.filter(
    c => c.nodeType === NodeType.ELEMENT_NODE,
  ) as HTMLElement[] // redundant probably
  return Array.from(childElements)
}

const helper = (
  flows: DataFlow[],
  darts: DataDart[],
  flowState: FullFlowState,
  fragment: HTMLElement[],
): StoneType => {
  if (flowState.flocation.node >= flowState.flowNodes.length) {
    const branches = darts.filter(v => v.from == flowState.flocation.flow)
    if (branches.length === 0) {
      return {
        value: null,
        flowState: () => flowState,
        view: () => <>{fragment.map(v => v)}</>,
        paddleAfter: false,
      }
      const dart = branches[0] // TODO flogic
      const flowId = dart.to
      const flowNodes = refill(flows, flowId)
      return helper(
        flows,
        darts,
        {
          ...flowState,
          flocation: {
            flow: flowId,
            node: 0,
          },
          flowNodes,
        },
        fragment,
      )
    }
  }

  const el = flowState.flowNodes[flowState.flocation.node]
  const nextFlowState = {
    ...flowState,
    flocation: {
      ...flowState.flocation,
      node: flowState.flocation.node + 1,
    },
  }
  let match

  if (el.tagName === 'HR') {
    return {
      value: null,
      flowState: () => nextFlowState,
      paddleAfter: true,
      view: NextButton(true, toJsx(fragment)),
    }
  } else if (el.tagName === 'P' && (match = el.innerText?.match(/^(...)|…$/g))) {
    return {
      value: null,
      flowState: () => nextFlowState,
      paddleAfter: false,
      view: NextButton(false, toJsx(fragment)),
    }
  } else if (
    el.tagName === 'p' &&
    (match = el.innerText?.match(
      /(?<=^|\n)(?:(?<assignment>[A-z_]+[A-z0-9_]*) *=)? *\[ *(?<choices>(?:(?:(?:(?:[A-z0-9_!?*'"()^$.]+[A-z0-9_!?*'"()^$ .]*)(?:(?:, *)|(?= *\])))){2,}))\](?=$|\n)/g,
    ))
  ) {
    const choices = match.groups!.choices.split(',').map(trim)
    return {
      value: null,
      flowState: () => nextFlowState,
      paddleAfter: false,
      view: NextButton(false, toJsx(fragment)),
    }
  }

  fragment.push(el)
  return helper(flows, darts, nextFlowState, fragment)
}
