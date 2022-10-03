import { useCallback, useRef, useState } from "react";
import { Floem, Flow } from "../floem";
import TextUpdaterNode from "./nodeTypes/textUpdaterNode";

import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "Flowstart" },
    position: { x: 5, y: 5 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "Node 2" },
    position: { x: 50, y: 100 },
    type: "textUpdater",
  },
];

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
  },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

interface FlowEditorProps {
  flow: Flow;
}

interface FlowpadProps {
  floem: Floem;
}

export const Flowpad = ({ floem }: FlowpadProps) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const floemRef = useRef(floem);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="grow">
      <div id="toolbar"></div>
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
