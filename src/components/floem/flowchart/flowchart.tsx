import { useCallback } from 'react'
import ReactFlow, { applyEdgeChanges, applyNodeChanges, Background, Controls } from 'reactflow'
import { DataFloem } from '../../../model/core/floem'
import {
  toDataDarts,
  toDataFlows,
  toFlowchartEdges,
  toFlowchartNodes,
} from '../../../model/core/reactflowAdapters'

import React from 'react'
import 'reactflow/dist/style.css'
import { genDartId } from '../../../model/core/ids'
import { Mutate } from '../../../model/core/mutators'
import Breadcrumbs from './breadcrumbs'
import FlowchartDart, { FlowchartEdge } from './flowchartDart'
import FlowchartFlow, { FlowchartNode } from './flowchartFlow'
import { Toolbar, ToolbarProps } from './toolbar/toolbar'

const nodeTypes = { flow: FlowchartFlow }
const edgeTypes = { dart: FlowchartDart }

interface FlowchartProps {
  mutate: Mutate
  floem: DataFloem
}

export const Flowchart = ({ floem, mutate }: FlowchartProps) => {
  const [nodeSelections, setNodeSelections] = React.useState<boolean[]>(
    Array(floem.flows.length).fill(false),
  )
  const [edgeSelections, setEdgeSelections] = React.useState<boolean[]>(
    Array(floem.darts.length).fill(false),
  )
  const nodes: FlowchartNode[] = toFlowchartNodes(mutate, floem, nodeSelections)
  const edges: FlowchartEdge[] = toFlowchartEdges(mutate, floem, edgeSelections)

  const onNodesChange = useCallback(
    changes => {
      const newNodes = applyNodeChanges(changes, nodes)
      const { flows, selections } = toDataFlows(newNodes)
      mutate.updateFloem({ id: floem.id, flows }) // this might be race condition with below
      setNodeSelections(selections)
    },
    [floem],
  )

  const onEdgesChange = useCallback(
    changes => {
      const newEdges = applyEdgeChanges(changes, edges) as FlowchartEdge[]
      const { darts, selections } = toDataDarts(newEdges)
      mutate.updateFloem({ id: floem.id, darts })
      setEdgeSelections(selections)
    },
    [floem],
  )

  const onConnect = useCallback(
    params => {
      mutate.addDart({
        floem: floem.id,
        dart: {
          id: genDartId(),
          from: params.source,
          case: params.sourceHandle,
          to: params.target,
        },
      })
    },
    [floem],
  )

  const toolbarProps: ToolbarProps = {
    mutate,
    floem,
    nodeSelections,
    edgeSelections,
  }

  return (
    <div className='absolute top-0 bottom-0 left-0 right-0'>
      <div className='absolute z-50'>
        <Breadcrumbs floem={floem} mutate={mutate} />
      </div>
      <div className='absolute z-50 right-0'>
        <Toolbar {...toolbarProps} />
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
