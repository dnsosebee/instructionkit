import { Map } from 'immutable'
import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { logger as parentLogger } from '../../../../../lib/logger'
import { toFlowchartEdges, toFlowchartNodes } from '../../../../../model/reactflow/adapters'
import { genDartId } from '../../../../../model/replicache/spaces/proj/entries/dart/dart'
import { GOTO_DART_TYPE } from '../../../../../model/replicache/spaces/proj/entries/dart/types/goto'
import { genFlowId } from '../../../../../model/replicache/spaces/proj/entries/flow/flow'
import {
  BRANCH_FLOW_TYPE,
  EMPTY_BRANCH_FLOWTEXT,
} from '../../../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { START_FLOW_TYPE } from '../../../../../model/replicache/spaces/proj/entries/flow/types/start'
import { FloemChangeEvent, useFlowchartCtx } from '../../../../loaders/providers/flowchartProvider'
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
  const { flows, darts, send } = useFlowchartCtx()
  const [nodeSelections, setNodeSelections] = useState<Map<string, boolean>>(Map([]))
  const [edgeSelections, setEdgeSelections] = useState<Map<string, boolean>>(Map([]))

  const nodes = toFlowchartNodes(flows, nodeSelections)
  const edges = toFlowchartEdges(darts, edgeSelections)

  // HTML elemenet ref for the reactflow component wrapper
  const reactFlowWrapper = useRef<null | HTMLDivElement>(null)
  const connectingCase = useRef<null | { flowId: string; caseId: string }>(null)
  const { project } = useReactFlow()

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      const floemEvents: FloemChangeEvent[] = []
      let updatedSelections = nodeSelections
      changes.forEach(change => {
        if (change.type === 'position') {
          const { id, position } = change
          if (position) {
            floemEvents.push({
              action: 'updateFlow',
              update: {
                id,
                position,
              },
            })
          }
        } else if (change.type === 'remove') {
          const { id } = change
          floemEvents.push({
            action: 'deleteFlow',
            id,
          })
          updatedSelections = updatedSelections.set(id, false)
        } else if (change.type === 'select') {
          const { id, selected } = change
          updatedSelections = updatedSelections.set(id, selected)
        }
      })
      setNodeSelections(updatedSelections)
      logger.debug('setNodeSelections', { updatedSelections: updatedSelections.toString() })
      send(floemEvents)
    },
    [nodeSelections],
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    changes => {
      const floemEvents: FloemChangeEvent[] = []
      let updatedSelections = edgeSelections
      changes.forEach(change => {
        if (change.type === 'add') {
          const {
            item: { id, source, sourceHandle, target, targetHandle },
          } = change
          floemEvents.push({
            action: 'createDart',
            dart: {
              id,
              type: GOTO_DART_TYPE,
              from: source,
              case: sourceHandle!,
              to: target,
            },
          })
        } else if (change.type === 'remove') {
          const { id } = change
          floemEvents.push({
            action: 'deleteDart',
            id,
          })
          updatedSelections = updatedSelections.set(id, false)
        } else if (change.type === 'select') {
          const { id, selected } = change
          updatedSelections = updatedSelections.set(id, selected)
        }
      })
      setEdgeSelections(updatedSelections)
      logger.debug('setEdgeSelections', { updatedSelections: updatedSelections.toString() })
      send(floemEvents)
    },
    [edgeSelections],
  )

  const onConnect: OnConnect = useCallback(params => {
    send({
      action: 'createDart',
      dart: {
        id: genDartId(),
        type: GOTO_DART_TYPE,
        from: params.source!,
        case: params.sourceHandle!,
        to: params.target!,
      },
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
    if (connectingCase.current!.caseId === null) {
      // This prevents mutations from triggering on drag from a flow's input handle
      return
    }
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
      send([
        {
          action: 'createFlow',
          flow: {
            id: newFlowId,
            type: BRANCH_FLOW_TYPE,
            flowtext: EMPTY_BRANCH_FLOWTEXT,
            position: newFlowPosition,
          },
        },
        {
          action: 'createDart',
          dart: {
            id: newDartId,
            type: GOTO_DART_TYPE,
            from: connectingCase.current!.flowId,
            case: connectingCase.current!.caseId,
            to: newFlowId,
          },
        },
      ])
    }
  }, [])

  const toolbarProps: ToolbarProps = {
    send,
  }

  return (
    <div className='absolute top-0 bottom-0 left-0 right-0' ref={reactFlowWrapper}>
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
        // panOnScroll
        // selectionOnDrag
        // panOnDrag={[0, 1]}
        // selectionMode={SelectionMode.Partial}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
