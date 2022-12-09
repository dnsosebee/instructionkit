import { FlowchartEdge } from '../../components/floem/flowchart/flowchartDart'
import { FlowchartNode } from '../../components/floem/flowchart/flowchartFlow'
import { DataDart } from '../replicache/spaces/proj-[id]/entries/dart'
import { DataFlow } from '../replicache/spaces/proj-[id]/entries/flow'
import { WorkspaceMutate } from '../replicache/spaces/proj-[id]/projectMutators'
import { DataFloem } from './floem'

// adapters from Floem to React Flow nodes and edges

export const toFlowchartNodes = (
  mutate: WorkspaceMutate,
  floem: DataFloem,
  selections: boolean[],
): FlowchartNode[] => {
  return floem.flows.map((flow, i) => ({
    id: flow.id,
    type: 'flow',
    // dragHandle: ".drag-handle",
    position: flow.position,
    data: {
      mutate,
      flow,
      selected: selections[i],
      floem: floem,
    },
    selected: selections[i],
  }))
}

export const toFlowchartEdges = (
  mutate: WorkspaceMutate,
  floem: DataFloem,
  selections: boolean[],
): FlowchartEdge[] => {
  return floem.darts.map((dart, i) => ({
    id: dart.id,
    source: dart.from,
    sourceHandle: dart.case,
    target: dart.to,
    type: 'dart',
    selected: selections[i],
    interactionWidth: 30,
  }))
}
// adapters from React Flow nodes and edges to Floem

export const toDataFlows = (
  flowchartNodes: FlowchartNode[],
): { flows: DataFlow[]; selections: boolean[] } => {
  return {
    flows: flowchartNodes.map(node => ({
      id: node.id,
      flowtext: node.data.flow.flowtext,
      createdAt: node.data?.flow?.createdAt ?? Date.now(),
      position: node.position,
    })),
    selections: flowchartNodes.map(node => (node.selected ? true : false)),
  }
}

export const toDataDarts = (
  edges: FlowchartEdge[],
): { darts: DataDart[]; selections: boolean[] } => {
  return {
    darts: edges.map(edge => ({
      id: edge.id,
      from: edge.source,
      case: edge.sourceHandle,
      to: edge.target,
    })),
    selections: edges.map(edge => (edge.selected ? true : false)),
  }
}
