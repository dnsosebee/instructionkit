import { GetServerSideProps } from 'next'
import { ReactFlowProvider } from 'reactflow'
import { RootHandler } from '../../../../src/components/loaders/routesHandlers/rootHandler'
import { Flowchart } from '../../../../src/components/views/app/project/flowchart/flowchart'
import { setRoute } from '../../../../src/lib/route'

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
  return (
    <ReactFlowProvider>
      <Flowchart />
    </ReactFlowProvider>
  )
}
