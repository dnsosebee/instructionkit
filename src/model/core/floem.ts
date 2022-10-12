// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { Edge, Node } from 'reactflow'
import { ReadTransaction } from 'replicache'
import { FlowNodeProps } from '../../components/chart/flowNode'
import { DataFlow } from './flow'
import { Mutate } from './mutators'

export type DataFloem = {
  id: string
  title: string
  createdAt: number
  flows: DataFlow[]
  darts: DataDart[]
}

export type DataDart = {
  id: string
  floem: string
  from: string
  to: string
  case: string
}

export type DataDartUpdate = Partial<DataDart> & Pick<DataDart, 'id'> & Pick<DataDart, 'floem'>

export type FloemUpdate = Partial<DataFloem> & Pick<DataFloem, 'id'>

export async function listFloems(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as DataFloem[]
}

// adapters from Floem to React Flow nodes and edges

export type DartEdge = Edge & { data: { dart: DataDart; mutate: Mutate; selected: boolean } }

export const toReactFlowNodes = (
  mutate: Mutate,
  floem: DataFloem,
  selections: boolean[],
): Node<FlowNodeProps>[] => {
  return floem.flows.map((flow, i) => ({
    id: flow.id,
    type: 'flow',
    // dragHandle: ".drag-handle",
    position: flow.position,
    data: { mutate, flow, selected: selections[i] },
    selected: selections[i],
  }))
}

export const toReactFlowEdges = (
  mutate: Mutate,
  floem: DataFloem,
  selections: boolean[],
): DartEdge[] => {
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

export const toFloemFlows = (
  nodes: Node<FlowNodeProps>[],
): { flows: DataFloem['flows']; selections: boolean[] } => {
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

export const toFloemDarts = (
  edges: DartEdge[],
): { darts: DataFloem['darts']; selections: boolean[] } => {
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

export const toNewFloemDarts = (edges: DartEdge[], floem: string): DataFloem['darts'] => {
  return edges.map(edge => ({
    id: edge.id,
    floem,
    from: edge.source,
    to: edge.target,
    case: 'hello',
  }))
}
