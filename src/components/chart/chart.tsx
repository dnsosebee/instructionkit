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
  const nodes: Node<FlowNodeProps>[] = toReactFlowNodes(mutate, floem)
  const edges: DartEdge[] = toReactFlowEdges(mutate, floem)

  const onNodesChange = useCallback(
    changes => {
      console.log(`Edge changes: `, changes)
      const newNodes = applyNodeChanges(changes, nodes)
      mutate.updateFloem({ id: floem.id, flows: toFloemFlows(newNodes) })
    },
    [floem],
  )

  const onEdgesChange = useCallback(
    changes => {
      console.log(`Edge changes: `, changes)
      const newEdges = applyEdgeChanges(changes, edges) as DartEdge[]
      mutate.updateFloem({ id: floem.id, darts: toFloemDarts(newEdges) })
    },
    [floem],
  )

  const onConnect = useCallback(
    params => {
      const newEdges = addEdge(params, edges) as DartEdge[]
      console.log(`New edges: `, newEdges)
      mutate.updateFloem({ id: floem.id, darts: toNewFloemDarts(newEdges, floem.id) })
    },
    [floem],
  )

  // const onSelectionChange = useCallback(
  //   (e: OnSelectionChangeParams) => {
  //     console.log("Selected elements:", selectedElements);
  //   },
  //   [floem, mutate]
  // )

  return (
    <div className='grow'>
      <div className='absolute z-50'>
        <Breadcrumbs floem={floem} mutate={mutate} />
      </div>
      <div className='absolute z-50 right-0 pt-3 pr-3'>
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
        onSelectionChange={e => console.log(e)}
        minZoom={0.2}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
