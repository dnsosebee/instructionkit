import { FlowchartEdge } from '../../components/floem/flowchart/flowchartDart'
import { FlowchartNode } from '../../components/floem/flowchart/flowchartFlow'
import { DataDart } from './dart'
import { DataFloem } from './floem'
import { DataFlow } from './flow'
import { Mutate } from './mutators'

// adapters from Floem to React Flow nodes and edges

export const toFlowchartNodes = (
  mutate: Mutate,
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
  mutate: Mutate,
  floem: DataFloem,
  selections: boolean[],
): FlowchartEdge[] => {
  return floem.darts.map((dart, i) => ({
    id: dart.id,
    source: dart.from,
    target: dart.to,
    label: dart.case,
    data: { mutate, dart },
    type: 'dart',
    selected: selections[i],
    interactionWidth: 30,
  }))
}
// adapters from React Flow nodes and edges to Floem

export const toDataFlows = (
  nodes: FlowchartNode[],
): { flows: DataFlow[]; selections: boolean[] } => {
  return {
    flows: nodes.map(node => ({
      id: node.id,
      floem: node.data.flow.floem,
      flowtext: node.data.flow.flowtext,
      createdAt: Date.now(),
      position: node.position,
    })),
    selections: nodes.map(node => (node.selected ? true : false)),
  }
}

export const toDataDarts = (
  edges: FlowchartEdge[],
): { darts: DataDart[]; selections: boolean[] } => {
  return {
    darts: edges.map(edge => ({
      id: edge.id,
      floem: edge.data.dart.floem,
      from: edge.source,
      to: edge.target,
      case: edge.data.dart.case,
    })),
    selections: edges.map(edge => (edge.selected ? true : false)),
  }
}
