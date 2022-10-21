// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { Edge } from 'reactflow'
import { ReadTransaction } from 'replicache'
import { FlowchartEdge } from '../../components/flowchart/flowchartDart'
import { FlowchartNode } from '../../components/flowchart/flowchartFlow'
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
  edges: (FlowchartEdge | Edge)[],
  floem: string,
): { darts: DataDart[]; selections: boolean[] } => {
  return {
    darts: edges.map(edge => ({
      id: edge.id,
      floem: edge.data && edge.data.dart ? edge.data.dart.floem : floem,
      from: edge.source,
      to: edge.target,
      case: edge.data && edge.data.dart ? edge.data.dart.case : '',
    })),
    selections: edges.map(edge => (edge.selected ? true : false)),
  }
}
