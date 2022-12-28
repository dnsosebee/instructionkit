import { Map } from 'immutable'
import {
  FlowchartEdge,
  FlowchartNode,
} from '../../components/views/app/project/flowchart/flowchart'
import { BranchNode } from '../../components/views/app/project/flowchart/flows/branch'
import { StartNode } from '../../components/views/app/project/flowchart/flows/start'
import { Dart } from '../replicache/spaces/proj/entries/dart/dart'
import { GOTO_DART_TYPE } from '../replicache/spaces/proj/entries/dart/types/goto'
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
  darts: Dart[],
  dartSelections: Map<Dart['id'], boolean>,
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

export const toFlowsAndSelections = (
  nodes: FlowchartNode[],
): { updatedFlows: Flow[]; updatedNodeSelections: Map<Flow['id'], boolean> } => {
  const updatedFlows: Flow[] = []
  const updatedNodeSelections = Map<Flow['id'], boolean>()
  nodes.forEach(node => {
    updatedFlows.push({
      id: node.id,
      type: node.type as typeof START_FLOW_TYPE | typeof BRANCH_FLOW_TYPE,
      position: node.position,
      flowtext: node.data.flow.flowtext,
    })
    updatedNodeSelections.set(node.id, node.selected ?? false)
  })
  return { updatedFlows, updatedNodeSelections }
}

export const toDartsAndSelections = (
  edges: FlowchartEdge[],
): { updatedDarts: Dart[]; updatedEdgeSelections: Map<Dart['id'], boolean> } => {
  const updatedDarts: Dart[] = []
  const updatedEdgeSelections = Map<Dart['id'], boolean>()
  edges.forEach(edge => {
    updatedDarts.push({
      id: edge.id,
      type: edge.type as typeof GOTO_DART_TYPE,
      from: edge.source,
      fromHandle: edge.sourceHandle,
      to: edge.target,
      toHandle: edge.targetHandle ?? undefined,
    })
    updatedEdgeSelections.set(edge.id, edge.selected ?? false)
  })
  return { updatedDarts, updatedEdgeSelections }
}
