import { useCallback, useRef } from 'react'
import ReactFlow, { Background, Controls, OnConnect, useReactFlow } from 'reactflow'
import { logger as parentLogger } from '../../../../../lib/logger'
import { genDartId } from '../../../../../model/replicache/spaces/proj/entries/dart/dart'
import { GOTO_DART_TYPE } from '../../../../../model/replicache/spaces/proj/entries/dart/types/goto'
import { genFlowId } from '../../../../../model/replicache/spaces/proj/entries/flow/flow'
import {
  BRANCH_FLOW_TYPE,
  EMPTY_BRANCH_FLOWTEXT,
} from '../../../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { START_FLOW_TYPE } from '../../../../../model/replicache/spaces/proj/entries/flow/types/start'
import { useFlowchartCtx } from '../../../../loaders/providers/flowchartProvider'
import { GotoEdge } from './darts/goto'
import { BranchNode } from './flows/branch'
import { StartNode } from './flows/start'
import { Toolbar, ToolbarProps } from './toolbar'

const logger = parentLogger.child({ component: 'Flowchart' })

export type FlowchartNode = StartNode | BranchNode
export type FlowchartEdge = GotoEdge

const FLOW_OFFSET = 200

const nodeTypes = { [START_FLOW_TYPE]: StartNode, [BRANCH_FLOW_TYPE]: BranchNode }
const edgeTypes = { [GOTO_DART_TYPE]: GotoEdge }

export const Flowchart = () => {
  const {
    nodes,
    edges,
    nodeSelections,
    edgeSelections,
    title,
    handleNodesChange,
    handleEdgesChange,
    updateFlowtext,
    addBranch,
    addDart,
    updateTitle,
  } = useFlowchartCtx()
  // HTML elemenet ref for the reactflow component wrapper
  const reactFlowWrapper = useRef<null | HTMLDivElement>(null)
  const connectingCase = useRef<null | { flowId: string; caseId: string }>(null)
  const { project } = useReactFlow()

  // const onNodesChange: OnNodesChange = useCallback(changes => {
  //   const selectionChanges = changes.filter(c => c.type === 'select') as NodeSelectionChange[]
  //   const positionChanges = changes.filter(c => c.type === 'position') as NodePositionChange[]
  //   const removeChanges = changes.filter(c => c.type === 'remove') as NodeRemoveChange[]

  //   let newNodeSelections = nodeSelections
  //   selectionChanges.forEach(c => {
  //     newNodeSelections = newNodeSelections.set(c.id, c.selected)
  //   })
  //   const removes: FlowRemove[] = removeChanges.map(c => {
  //     newNodeSelections = newNodeSelections.delete(c.id)
  //     return { type: flows.find(flow => flow.id === c.id)!.type, id: c.id }
  //   })
  //   const positionUpdates: FlowPositionUpdate[] = positionChanges.map(c => ({
  //     id: c.id,
  //     type: flows.find(flow => flow.id === c.id)!.type,
  //     position: c.position!,
  //   }))

  //   setNodeSelections(newNodeSelections)
  //   projectRep.mutate.applyFlowChanges({ removes, positionUpdates })
  // }, [])

  const onConnect: OnConnect = useCallback(params => {
    addDart({
      id: genDartId(),
      type: GOTO_DART_TYPE,
      from: params.source!,
      fromHandle: params.sourceHandle!,
      to: params.target!,
    })
  }, [])

  const onConnectStart = useCallback((_, { nodeId, handleId }) => {
    logger.debug('onConnectStart', { nodeId, handleId })
    connectingCase.current = {
      flowId: nodeId,
      caseId: handleId,
    }
  }, [])

  const onConnectEnd = useCallback(event => {
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
      addBranch({
        id: newFlowId,
        type: BRANCH_FLOW_TYPE,
        flowtext: EMPTY_BRANCH_FLOWTEXT,
        position: newFlowPosition,
      })
      addDart({
        id: newDartId,
        type: GOTO_DART_TYPE,
        from: connectingCase.current!.flowId,
        fromHandle: connectingCase.current!.caseId,
        to: newFlowId,
      })
    }
  }, [])

  const toolbarProps: ToolbarProps = {
    addBranch,
  }

  return (
    <div className='absolute top-0 bottom-0 left-0 right-0' ref={reactFlowWrapper}>
      <div className='absolute z-50 right-0'>
        <Toolbar {...toolbarProps} />
      </div>
      <ReactFlow
        nodes={nodes}
        onNodesChange={handleNodesChange}
        edges={edges}
        onEdgesChange={handleEdgesChange}
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
  )
}
