import { Map } from 'immutable'
import {
  FlowchartEdge,
  FlowchartNode,
} from '../../components/views/app/project/flowchart/flowchart'
import { BranchNode } from '../../components/views/app/project/flowchart/flows/branch'
import { StartNode } from '../../components/views/app/project/flowchart/flows/start'
import { RepDart } from '../replicache/spaces/proj/entries/dart/dart'
import { RepFlow } from '../replicache/spaces/proj/entries/flow/flow'
import { BRANCH_FLOW_TYPE } from '../replicache/spaces/proj/entries/flow/types/branch'
import { START_FLOW_TYPE } from '../replicache/spaces/proj/entries/flow/types/start'

export const toFlowchartNodes = (
  flows: RepFlow[],
  flowSelections: Map<RepFlow['id'], boolean>,
): FlowchartNode[] => {
  return flows.map(flow => {
    switch (flow.type) {
      case START_FLOW_TYPE:
        return {
          id: flow.id,
          type: flow.type,
          position: flow.position,
          data: {
            flow,
          },
          selected: flowSelections.get(flow.id) ?? false,
        } as StartNode
      case BRANCH_FLOW_TYPE:
        return {
          id: flow.id,
          type: flow.type,
          position: flow.position,
          data: {
            flow,
          },
          selected: flowSelections.get(flow.id) ?? false,
        } as BranchNode
      default:
        throw new Error(`Unimplemented flow type: ${flow.type}`)
    }
  })
}

export const toFlowchartEdges = (
  darts: RepDart[],
  dartSelections: Map<RepDart['id'], boolean>,
): FlowchartEdge[] => {
  return darts.map(dart => {
    return {
      id: dart.id,
      type: dart.type,
      source: dart.from,
      sourceHandle: dart.fromHandle,
      target: dart.to,
      targetHandle: dart.toHandle,
      selected: dartSelections.get(dart.id) ?? false,
      data: {
        dart,
      },
    }
  })
}
