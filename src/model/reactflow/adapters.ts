import { Map } from 'immutable'
import {
  FlowchartEdge,
  FlowchartNode,
} from '../../components/views/app/project/flowchart/flowchart'
import { BranchNode } from '../../components/views/app/project/flowchart/flows/branch'
import { StartNode } from '../../components/views/app/project/flowchart/flows/start'
import { Dart } from '../replicache/spaces/proj/entries/dart/dart'
import { Flow } from '../replicache/spaces/proj/entries/flow/flow'
import { BRANCH_FLOW_TYPE } from '../replicache/spaces/proj/entries/flow/types/branch'
import { START_FLOW_TYPE } from '../replicache/spaces/proj/entries/flow/types/start'

export const toFlowchartNodes = (
  flows: Flow[],
  flowSelections: Map<Flow['id'], boolean>,
): FlowchartNode[] => {
  return flows.map(flow => {
    switch (flow.type) {
      case START_FLOW_TYPE:
        return {
          id: flow.id,
          type: flow.type,
          position: flow.position,
          data: {
            start: flow,
          },
          selected: flowSelections.get(flow.id) ?? false,
          deletable: false,
        } as StartNode
      case BRANCH_FLOW_TYPE:
        return {
          id: flow.id,
          type: flow.type,
          position: flow.position,
          data: {
            branch: flow,
          },
          selected: flowSelections.get(flow.id) ?? false,
        } as BranchNode
      default:
        throw new Error(`Unimplemented flow type: ${flow.type}`)
    }
  })
}

export const toFlowchartEdges = (
  darts: Dart[],
  dartSelections: Map<Dart['id'], boolean>,
): FlowchartEdge[] => {
  return darts.map(dart => {
    return {
      id: dart.id,
      type: dart.type,
      source: dart.from,
      sourceHandle: dart.case,
      target: dart.to,
      selected: dartSelections.get(dart.id) ?? false,
      data: {
        dart,
      },
    }
  })
}
