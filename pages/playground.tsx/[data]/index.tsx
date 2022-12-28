import { Map } from 'immutable'
import { GetServerSideProps } from 'next'
import React from 'react'
import { applyEdgeChanges, applyNodeChanges, EdgeChange, NodeChange } from 'reactflow'
import FlowchartProvider, {
  FlowchartProviderProps,
} from '../../../src/components/loaders/providers/flowchartProvider'
import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import {
  Flowchart,
  FlowchartEdge,
  FlowchartNode,
} from '../../../src/components/views/app/project/flowchart/flowchart'
import { BranchNodeData } from '../../../src/components/views/app/project/flowchart/flows/branch'
import { StartNodeData } from '../../../src/components/views/app/project/flowchart/flows/start'
import { getRoute, setRoute } from '../../../src/lib/route'
import {
  toDartsAndSelections,
  toFlowchartEdges,
  toFlowchartNodes,
  toFlowsAndSelections,
} from '../../../src/model/reactflow/adapters'
import { Dart } from '../../../src/model/replicache/spaces/proj/entries/dart/dart'
import { Flow } from '../../../src/model/replicache/spaces/proj/entries/flow/flow'
import { BranchFlow } from '../../../src/model/replicache/spaces/proj/entries/flow/types/branch'
import {
  Playground,
  urlDecodePlayground,
  urlEncodePlayground,
} from '../../../src/model/url/playground'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const playgroundData = params?.playgroundData as string
  return {
    props: {
      playgroundData,
    },
  }
}

const PlaygroundPage = ({ playgroundData }: { playgroundData: string }) => {
  setRoute({ route: `/playground/${playgroundData}`, action: 'none' })
  return <RootHandler />
}

export default PlaygroundPage

/**
 *
 */

export const PlaygroundView = () => {
  const { playgroundData } = getRoute().params
  const playground = urlDecodePlayground(playgroundData)
  const { flows, darts, title } = playground

  const [nodeSelections, setNodeSelections] = React.useState<Map<Flow['id'], boolean>>(
    Map(flows.map(flow => [flow.id, false])),
  )
  const [edgeSelections, setEdgeSelections] = React.useState<Map<Dart['id'], boolean>>(
    Map(darts.map(dart => [dart.id, false])),
  )
  const nodes: FlowchartNode[] = toFlowchartNodes(flows, nodeSelections)
  const edges: FlowchartEdge[] = toFlowchartEdges(darts, edgeSelections)

  const updatePlayground = (update: Partial<Playground>) => {
    const updatedPlayground = { ...playground, ...update }
    setRoute({ route: `/playground/${urlEncodePlayground(updatedPlayground)}`, action: 'push' })
  }

  const flowchartProviderProps: FlowchartProviderProps = {
    children: undefined,
    title,
    nodes,
    edges,
    nodeSelections,
    edgeSelections,
    handleNodesChange: (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges<StartNodeData | BranchNodeData>(changes, nodes)
      const { updatedNodeSelections, updatedFlows } = toFlowsAndSelections(
        updatedNodes as FlowchartNode[],
      )
      setNodeSelections(updatedNodeSelections)
      updatePlayground({ flows: updatedFlows })
    },
    handleEdgesChange: (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges)
      const { updatedEdgeSelections, updatedDarts } = toDartsAndSelections(
        updatedEdges as FlowchartEdge[],
      )
      setEdgeSelections(updatedEdgeSelections)
      updatePlayground({ darts: updatedDarts })
    },
    addBranch: (branch: BranchFlow) => {
      updatePlayground({ flows: [...flows, branch] })
    },
    addDart: (dart: Dart) => {
      updatePlayground({ darts: [...darts, dart] })
    },
    updateFlowtext: (id: string, type: string, text: string) => {
      const updatedFlows: Flow[] = playground.flows.map(flow => {
        if (flow.id === id) {
          return { ...flow, flowtext: text }
        }
        return flow
      })
      updatePlayground({ flows: updatedFlows })
    },
    updateTitle: (title: string) => {
      updatePlayground({ title })
    },
  }
  return (
    <FlowchartProvider {...flowchartProviderProps}>
      <Flowchart />
    </FlowchartProvider>
  )
}
