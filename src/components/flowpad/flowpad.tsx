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

  const onNodesChange = useCallback(
    (changes) => {
      const newNodes = applyNodeChanges(changes, nodes);
      mutate.updateFloem({ id: floem.id, flows: toFloemFlows(newNodes) });
    },
    [floem]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges) as DartEdge[];
      mutate.updateFloem({ id: floem.id, darts: toFloemDarts(newEdges) });
    },
    [floem]
  );

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges) as DartEdge[];
      mutate.updateFloem({ id: floem.id, darts: toFloemDarts(newEdges) });
    },
    [floem]
  );

  const onClickAddFlowButton = () => {
    console.log("Adding new flow");
    mutate.addFlow(floem.id);
  };

  const onClickRemoveFlowButton = () => {
    console.log("Removing flow");
    // mutate.removeFlow(floem.id, state.selectedId)
  };

  // const onSelectionChange = useCallback(
  //   (e: OnSelectionChangeParams) => {
  //     console.log("Selected elements:", selectedElements);
  //   },
  //   [floem, mutate]
  // )

  return (
    <div className="grow">
      <div id="toolbar" className="m-1">
        <button className="tool-button" onClick={onClickAddFlowButton}>
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
        onSelectionChange={(e) => console.log(e)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
