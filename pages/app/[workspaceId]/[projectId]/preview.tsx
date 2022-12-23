import { GetServerSideProps } from 'next'
import { RootHandler } from '../../../../src/components/loaders/routesHandlers/rootHandler'
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

const PreviewPage = ({ workspaceId, projectId }: { workspaceId: string; projectId: string }) => {
  setRoute({ route: `/app/${workspaceId}/${projectId}/preview`, action: 'none' })
  return <RootHandler />
}

export default PreviewPage
