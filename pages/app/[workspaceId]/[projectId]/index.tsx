import { Map } from 'immutable'
import { GetServerSideProps } from 'next'
import { EdgeChange, NodeChange, ReactFlowProvider } from 'reactflow'
import FlowchartProvider, {
  FlowchartProviderProps,
} from '../../../../src/components/loaders/providers/flowchartProvider'
import { RootHandler } from '../../../../src/components/loaders/routesHandlers/rootHandler'
import Breadcrumbs from '../../../../src/components/views/app/project/flowchart/breadcrumbs'
import { Flowchart } from '../../../../src/components/views/app/project/flowchart/flowchart'
import { setRoute } from '../../../../src/lib/route'
import { Dart } from '../../../../src/model/replicache/spaces/proj/entries/dart/dart'
import { BranchFlow } from '../../../../src/model/replicache/spaces/proj/entries/flow/types/branch'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  const projectId = params?.projectId as string
  return {
    props: {
      workspaceId,
      projectId,
    },
  }
}

const ProjectPage = ({ workspaceId, projectId }: { workspaceId: string; projectId: string }) => {
  setRoute({ route: `/app/${workspaceId}/${projectId}`, action: 'none' })
  return <RootHandler />
}

export default ProjectPage

/**
 *
 */

export const ProjectView = () => {
  const flowchartProviderProps: Omit<FlowchartProviderProps, 'children'> = {
    nodes: [],
    edges: [],
    nodeSelections: Map(),
    edgeSelections: Map(),
    title: '',
    handleNodesChange: function (changes: NodeChange[]): void {
      throw new Error('Function not implemented.')
    },
    handleEdgesChange: function (changes: EdgeChange[]): void {
      throw new Error('Function not implemented.')
    },
    addBranch: function (branch: BranchFlow): void {
      throw new Error('Function not implemented.')
    },
    addDart: function (dart: Dart): void {
      throw new Error('Function not implemented.')
    },
    updateFlowtext: function (id: string, type: string, flowtext: string): void {
      throw new Error('Function not implemented.')
    },
    updateTitle: function (title: string): void {
      throw new Error('Function not implemented.')
    },
  }
  return (
    <div>
      <div className='absolute z-50'>
        <Breadcrumbs />
      </div>
      <FlowchartProvider {...flowchartProviderProps}>
        <ReactFlowProvider>
          <Flowchart />
        </ReactFlowProvider>
      </FlowchartProvider>
    </div>
  )
}
