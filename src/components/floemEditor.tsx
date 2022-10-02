import { Floem, Flow, Dart, FloemUpdate } from '../floem'
import { keyBy } from 'lodash'
import React from 'react'

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

const nodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 5, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 } },
];

const edges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

interface FlowEditorProps {
  flow: Flow
}

interface FlowpadProps {
  floem: Floem;
  style: Object;
}

export const Flowpad = ({ floem }: FlowpadProps) => {
  

  return (
    <div className='flex-fill'>
      <div id='toolbar'>
      </div>
      <ReactFlow nodes={nodes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  ) 
}

