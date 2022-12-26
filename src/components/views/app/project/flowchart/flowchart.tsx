import { Map } from 'immutable'
import React, { useCallback, useRef } from 'react'
import ReactFlow, {
  NodePositionChange,
  NodeRemoveChange,
  NodeSelectionChange,
  OnEdgesChange,
  OnNodesChange,
  useReactFlow,
} from 'reactflow'
import { toFlowchartEdges, toFlowchartNodes } from '../../../../../model/reactflow/adapters'
import { RepDart } from '../../../../../model/replicache/spaces/proj/entries/dart/dart'
import { GOTO_DART_TYPE } from '../../../../../model/replicache/spaces/proj/entries/dart/types/goto'
import {
  FlowPositionUpdate,
  FlowRemove,
  RepFlow,
} from '../../../../../model/replicache/spaces/proj/entries/flow/flow'
import { BRANCH_FLOW_TYPE } from '../../../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { START_FLOW_TYPE } from '../../../../../model/replicache/spaces/proj/entries/flow/types/start'
import FlowchartProvider from '../../../../loaders/providers/flowchartProvider'
import { useProjectCtx } from '../../../../loaders/providers/projectProvider'
import { GotoEdge } from './darts/goto'
import { BranchNode } from './flows/branch'
import { StartNode } from './flows/start'

export type FlowchartNode = StartNode | BranchNode
export type FlowchartEdge = GotoEdge
const nodeTypes = { [START_FLOW_TYPE]: StartNode, [BRANCH_FLOW_TYPE]: BranchNode }
const edgeTypes = { [GOTO_DART_TYPE]: GotoEdge }

export const Flowchart = () => {
  const { projectRep, flows, darts } = useProjectCtx()
  const [nodeSelections, setNodeSelections] = React.useState<Map<RepFlow['id'], boolean>>(
    Map(flows.map(flow => [flow.id, false])),
  )
  const [edgeSelections, setEdgeSelections] = React.useState<Map<RepDart['id'], boolean>>(
    Map(darts.map(dart => [dart.id, false])),
  )
  const nodes: FlowchartNode[] = toFlowchartNodes(flows, nodeSelections)
  const edges: FlowchartEdge[] = toFlowchartEdges(darts, edgeSelections)
  // HTML elemenet ref for the reactflow component wrapper
  const reactFlowWrapper = useRef<null | HTMLDivElement>(null)
  const connectingCase = useRef<null | { flowId: string; caseId: string }>(null)
  const { project } = useReactFlow()

  const onNodesChange: OnNodesChange = useCallback(changes => {
    const selectionChanges = changes.filter(c => c.type === 'select') as NodeSelectionChange[]
    const positionChanges = changes.filter(c => c.type === 'position') as NodePositionChange[]
    const removeChanges = changes.filter(c => c.type === 'remove') as NodeRemoveChange[]

    let newNodeSelections = nodeSelections
    selectionChanges.forEach(c => {
      newNodeSelections = newNodeSelections.set(c.id, c.selected)
    })
    const removes: FlowRemove[] = removeChanges.map(c => {
      newNodeSelections = newNodeSelections.delete(c.id)
      return { type: flows.find(flow => flow.id === c.id)!.type, id: c.id }
    })
    const positionUpdates: FlowPositionUpdate[] = positionChanges.map(c => ({
      id: c.id,
      type: flows.find(flow => flow.id === c.id)!.type,
      position: c.position!,
    }))

    setNodeSelections(newNodeSelections)
    projectRep.mutate.applyFlowChanges({ removes, positionUpdates })
  }, [])

  const onEdgesChange: OnEdgesChange = useCallback(
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
          onNodesChange={}
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
