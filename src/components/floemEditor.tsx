import { Floem, Flow, Dart, FloemUpdate } from '../floem'
import React, { useState, useCallback } from 'react'

import ReactFlow, {
  addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Controls,
  Background,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes: Node[] = [{
  id: '1',
  data: { label: 'Node 1' },
  position: { x: 5, y: 5 },
  type: 'input',
},{
  id: '2',
  data: { label: 'Node 2' },
  position: { x: 50, y: 100 }
}]

const initialEdges = [{
  id: '1-2',
  source: '1',
  target: '2',
}]

interface FlowEditorProps {
  flow: Flow
}

interface FlowpadProps {
  floem: Floem;
  style: Object;
}

export const Flowpad = ({ floem }: FlowpadProps) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className='flex-fill'>
      <div id='toolbar'>
      </div>
      <ReactFlow 
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  ) 
}

