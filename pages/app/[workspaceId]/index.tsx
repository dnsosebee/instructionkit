import { GetServerSideProps } from 'next'
import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import { setRoute } from '../../../src/lib/route'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  return {
    props: {
      workspaceId,
    },
  }
}

const WorkspacePage = ({ workspaceId }: { workspaceId: string }) => {
  setRoute({ route: `/app/${workspaceId}`, replace: false })
  return <RootHandler />
}

export default WorkspacePage
