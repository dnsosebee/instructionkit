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
  toReactFlowEdges,
  toReactFlowNodes,
} from '../../model/core/floem'

import 'reactflow/dist/style.css'
import { Mutate } from '../app'
import FlowNode, { FlowNodeProps } from './flowNode'
import Dart from './dartEdge'

const nodeTypes = { flow: FlowNode }
const edgeTypes = { dart: Dart }

interface FlowpadProps {
  mutate: Mutate
  floem: DataFloem
}

export const Flowpad = ({ floem, mutate }: FlowpadProps) => {
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
      mutate.updateFloem({ id: floem.id, darts: toFloemDarts(newEdges) })
    },
    [floem],
  )

  const onClickAddFlowButton = () => {
    console.log('Adding new flow')
    mutate.addFlow(floem.id)
  }

  const onClickRemoveFlowButton = () => {
    console.log('Removing flow')
    // mutate.removeFlow(floem.id, state.selectedId)
  }

  // const onSelectionChange = useCallback(
  //   (e: OnSelectionChangeParams) => {
  //     console.log("Selected elements:", selectedElements);
  //   },
  //   [floem, mutate]
  // )

  return (
    <div className='grow'>
      <div id='toolbar' className='m-1'>
        <button className='tool-button' onClick={onClickAddFlowButton}>
          <div>Add Flow</div>
        </button>
        <button className='tool-button' onClick={onClickRemoveFlowButton}>
          <div>Delete Flow</div>
        </button>
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
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
