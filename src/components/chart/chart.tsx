import { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Node,
} from 'reactflow'
import {
  DartEdge,
  DataFloem,
  toFloemDarts,
  toFloemFlows,
  toNewFloemDarts,
  toReactFlowEdges,
  toReactFlowNodes,
} from '../../model/core/floem'

import React from 'react'
import 'reactflow/dist/style.css'
import { Mutate } from '../../model/core/mutators'
import Breadcrumbs from '../breadcrumbs'
import { Toolbar } from '../toolbar'
import Dart from './dartEdge'
import FlowNode, { FlowNodeProps } from './flowNode'

const nodeTypes = { flow: FlowNode }
const edgeTypes = { dart: Dart }

interface ChartProps {
  mutate: Mutate
  floem: DataFloem
  startFlowing: () => void
}

export const Chart = ({ floem, mutate, startFlowing }: ChartProps) => {
  const [nodeSelections, setNodeSelections] = React.useState<boolean[]>(
    Array(floem.flows.length).fill(false),
  )
  const [edgeSelections, setEdgeSelections] = React.useState<boolean[]>(
    Array(floem.darts.length).fill(false),
  )
  const nodes: Node<FlowNodeProps>[] = toReactFlowNodes(mutate, floem, nodeSelections)
  const edges: DartEdge[] = toReactFlowEdges(mutate, floem, edgeSelections)

  const onNodesChange = useCallback(
    changes => {
      const newNodes = applyNodeChanges(changes, nodes)
      const { flows, selections } = toFloemFlows(newNodes)
      mutate.updateFloem({ id: floem.id, flows }) // this might be race condition with below
      setNodeSelections(selections)
    },
    [floem],
  )

  const onEdgesChange = useCallback(
    changes => {
      const newEdges = applyEdgeChanges(changes, edges) as DartEdge[]
      const { darts, selections } = toFloemDarts(newEdges)
      mutate.updateFloem({ id: floem.id, darts })
      setEdgeSelections(selections)
    },
    [floem],
  )

  const onConnect = useCallback(
    params => {
      const newEdges = addEdge(params, edges) as DartEdge[]
      mutate.updateFloem({ id: floem.id, darts: toNewFloemDarts(newEdges, floem.id) })
    },
    [floem],
  )

  return (
    <div className='grow'>
      <div className='absolute z-50'>
        <Breadcrumbs floem={floem} mutate={mutate} />
      </div>
      <div className='absolute z-50 right-0'>
        <Toolbar mutate={mutate} flow={floem.flows[0]} />
      </div>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.2}
        onSelectionChange={e => console.log(e)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
