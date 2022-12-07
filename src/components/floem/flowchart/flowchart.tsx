import { useCallback, useRef } from 'react'
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import { DataFloem } from '../../../model/replicache-spaces/ws-[id]/keys/floem/floem'
import {
  toDataDarts,
  toDataFlows,
  toFlowchartEdges,
  toFlowchartNodes,
} from '../../../model/replicache-spaces/ws-[id]/keys/floem/reactflowAdapters'

import React from 'react'
import 'reactflow/dist/style.css'
import { logger as parentLogger } from '../../../logger'
import { genDartId, genFlowId } from '../../../model/replicache-spaces/ws-[id]/ids'
import { DEFAULT_FLOWTEXT } from '../../../model/replicache-spaces/ws-[id]/keys/floem/flow'
import { WorkspaceMutate } from '../../../model/replicache-spaces/ws-[id]/workspaceMutators'
import Breadcrumbs from './breadcrumbs'
import FlowchartDart, { FlowchartEdge } from './flowchartDart'
import FlowchartFlow, { FlowchartNode } from './flowchartFlow'
import FlowchartProvider from './flowchartProvider'
import { Toolbar, ToolbarProps } from './toolbar/toolbar'

const logger = parentLogger.child({ component: 'Flowchart' })

const nodeTypes = { flow: FlowchartFlow }
const edgeTypes = { dart: FlowchartDart }
const FLOW_OFFSET = 200

interface FlowchartProps {
  mutate: WorkspaceMutate
  floem: DataFloem
}

const InnerFlowchart = ({ floem, mutate }: FlowchartProps) => {
  const [nodeSelections, setNodeSelections] = React.useState<boolean[]>(
    Array(floem.flows.length).fill(false),
  )
  const [edgeSelections, setEdgeSelections] = React.useState<boolean[]>(
    Array(floem.darts.length).fill(false),
  )
  const nodes: FlowchartNode[] = toFlowchartNodes(mutate, floem, nodeSelections)
  const edges: FlowchartEdge[] = toFlowchartEdges(mutate, floem, edgeSelections)
  // HTML elemenet ref for the reactflow component wrapper
  const reactFlowWrapper = useRef<null | HTMLDivElement>(null)
  const connectingCase = useRef<null | { flowId: string; caseId: string }>(null)
  const { project } = useReactFlow()

  const onNodesChange = useCallback(
    changes => {
      const newNodes = applyNodeChanges(changes, nodes)
      const { flows, selections } = toDataFlows(newNodes)
      mutate.updateFloem({ id: floem.id, flows, updatedAt: Date.now() }) // this might be race condition with below
      setNodeSelections(selections)
    },
    [floem],
  )

  const onEdgesChange = useCallback(
    changes => {
      const newEdges = applyEdgeChanges(changes, edges) as FlowchartEdge[]
      const { darts, selections } = toDataDarts(newEdges)
      mutate.updateFloem({ id: floem.id, darts, updatedAt: Date.now() })
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

  const onConnectStart = useCallback((_, { nodeId, handleId }) => {
    logger.debug('onConnectStart', { nodeId, handleId })
    connectingCase.current = {
      flowId: nodeId,
      caseId: handleId,
    }
  }, [])

  const onConnectEnd = useCallback(
    event => {
      logger.debug('onConnectEnd', { event })
      const targetIsPane = event.target.classList.contains('react-flow__pane')
      logger.debug('onConnectEnd', 'targetIsPane', { targetIsPane })
      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current!.getBoundingClientRect()
        const newDartId = genDartId()
        const newFlowId = genFlowId()
        const newFlowPosition = project({
          x: event.clientX - left - FLOW_OFFSET,
          y: event.clientY - top,
        })
        mutate.addFlow({
          floemId: floem.id,
          flow: {
            id: newFlowId,
            flowtext: DEFAULT_FLOWTEXT,
            position: newFlowPosition,
          },
        })
        mutate.addDart({
          floem: floem.id,
          dart: {
            id: newDartId,
            from: connectingCase.current!.flowId,
            case: connectingCase.current!.caseId,
            to: newFlowId,
          },
        })
      }
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
    <FlowchartProvider>
      <div className='absolute top-0 bottom-0 left-0 right-0' ref={reactFlowWrapper}>
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
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          minZoom={0.2}
          onSelectionChange={e => console.log(e)}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </FlowchartProvider>
  )
}

const Flowchart = ({ floem, mutate }: FlowchartProps) => {
  return (
    <ReactFlowProvider>
      <InnerFlowchart floem={floem} mutate={mutate} />
    </ReactFlowProvider>
  )
}

export default Flowchart
