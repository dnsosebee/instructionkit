// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { Edge, Node } from "reactflow";
import { ReadTransaction } from "replicache";
import { Mutate } from "./app";
import { FlowNodeProps } from "./components/flowpad/nodeTypes/flowNode";
import { Flow } from "./flow";

export type Floem = {
  id: string;
  title: string;
  createdAt: number;
  flows: Flow[];
  darts: Dart[];
};

export type Dart = {
  id: string;
  from: string;
  to: string;
  case: string;
};

export type FloemUpdate = Partial<Floem> & Pick<Floem, "id">;

export async function listFloems(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as Floem[];
}

// adapters from Floem to React Flow nodes and edges

export type DartEdge = Edge & { label: string };

export const toReactFlowNodes = (
  mutate: Mutate,
  floem: Floem
): Node<FlowNodeProps>[] => {
  return floem.flows.map((flow) => ({
    id: flow.id,
    type: "flow",
    dragHandle: ".drag-handle",
    position: flow.position,
    data: { mutate, flow },
  }));
};

export const toReactFlowEdges = (floem: Floem): DartEdge[] => {
  return floem.darts.map((dart) => ({
    id: dart.id,
    source: dart.from,
    target: dart.to,
    label: dart.case,
  }));
};

// adapters from React Flow nodes and edges to Floem

export const toFloemFlows = (nodes: Node<FlowNodeProps>[]): Floem["flows"] => {
  return nodes.map((node) => ({
    id: node.id,
    floem: node.data.flow.floem,
    flowtext: node.data.flow.flowtext,
    createdAt: Date.now(),
    position: node.position,
  }));
};

export const toFloemDarts = (edges: DartEdge[]): Floem["darts"] => {
  return edges.map((edge) => ({
    id: edge.id,
    from: edge.source,
    to: edge.target,
    case: edge.label,
  }));
};
