import { useCallback } from "react";
import {
  DartEdge,
  Floem,
  toFloemDarts,
  toFloemFlows,
  toReactFlowEdges,
  toReactFlowNodes,
} from "../../floem";

import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import { Mutate } from "../../app";
import FlowNode from "./nodeTypes/flowNode";

const nodeTypes = { flow: FlowNode };

interface FlowpadProps {
  mutate: Mutate;
  floem: Floem;
}

export const Flowpad = ({ floem, mutate }: FlowpadProps) => {
  const nodes: Node[] = toReactFlowNodes(mutate, floem);
  const edges: DartEdge[] = toReactFlowEdges(floem);
  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => {
      const newNodes = applyNodeChanges(changes, nodes);
      mutate.updateFloem({ id: floem.id, flows: toFloemFlows(newNodes) });
    },
    [floem, mutate]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges) as DartEdge[];
      mutate.updateFloem({ id: floem.id, darts: toFloemDarts(newEdges) });
    },
    [floem, mutate]
  );

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges) as DartEdge[];
      mutate.updateFloem({ id: floem.id, darts: toFloemDarts(newEdges) });
    },
    [floem, mutate]
  );

  return (
    <div className="grow">
      <div id="toolbar"></div>
      <ReactFlow
        nodes={nodes}
        onNodesChange={() => {}}
        edges={edges}
        onEdgesChange={() => {}}
        onConnect={() => {}}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
