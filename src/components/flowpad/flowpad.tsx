import { useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Node,
} from "reactflow";
import {
  DartEdge,
  Floem,
  toFloemDarts,
  toFloemFlows,
  toReactFlowEdges,
  toReactFlowNodes,
} from "../../model/core/floem";

import "reactflow/dist/style.css";
import { Mutate } from "../app";
import FlowNode, { FlowNodeProps } from "./flowNode";

const nodeTypes = { flow: FlowNode };

interface FlowpadProps {
  mutate: Mutate;
  floem: Floem;
}

export const Flowpad = ({ floem, mutate }: FlowpadProps) => {
  const nodes: Node<FlowNodeProps>[] = toReactFlowNodes(mutate, floem);
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

  const onClickNewFlowButton = () => {
    console.log('Adding new flow')
    mutate.addFlow(floem.id)
  }

  return (
    <div className="grow">
      <div id="toolbar" className='m-1'>
        <button className='tool-button' onClick={onClickNewFlowButton}>
          <div>New Flow</div>
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
