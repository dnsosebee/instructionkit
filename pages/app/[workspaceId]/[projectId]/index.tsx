import { GetServerSideProps } from 'next'
import { ReactFlowProvider } from 'reactflow'
import FlowchartProvider, {
  FlowchartProviderProps,
} from '../../../../src/components/loaders/providers/flowchartProvider'
import { useProjectCtx } from '../../../../src/components/loaders/providers/projectProvider'
import { useWorkspaceCtx } from '../../../../src/components/loaders/providers/workspaceRepProvider'
import { RootHandler } from '../../../../src/components/loaders/routesHandlers/rootHandler'
import Breadcrumbs from '../../../../src/components/views/app/project/flowchart/breadcrumbs'
import { Flowchart } from '../../../../src/components/views/app/project/flowchart/flowchart'
import { getRoute, setRoute } from '../../../../src/lib/route'
import { FloemChangeEvent } from '../../../../src/model/persistence/shared/floemChangeEvent'

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
  const { workspaceId, projectId } = getRoute().params
  const { workspaceRep, projects } = useWorkspaceCtx()
  const { projectRep, flows, darts } = useProjectCtx()

  const project = projects.find(p => p.id === projectId)!
  const flowchartProviderProps: Omit<FlowchartProviderProps, 'children'> = {
    title: project.title,
    flows,
    darts,
    send: function (changes: FloemChangeEvent | FloemChangeEvent[]): void {
      if (!Array.isArray(changes)) {
        changes = [changes]
      }
      const projectChanges = []
      for (const change of changes) {
        if (change.action === 'updateTitle') {
          workspaceRep.mutate.updateProject({ id: projectId, title: change.title })
        } else {
          projectChanges.push(change)
        }
      }
      if (projectChanges.length > 0) {
        projectRep.mutate.applyChanges(projectChanges)
      }
    },
    previewHref: `/app/${workspaceId}/${projectId}/preview`,
  }
  return (
    <>
      <div className='absolute z-50 left-0'>
        <Breadcrumbs />
      </div>
      <FlowchartProvider {...flowchartProviderProps}>
        <ReactFlowProvider>
          <Flowchart />
        </ReactFlowProvider>
      </FlowchartProvider>
    </>
  )
  return <div>Project</div>
}
