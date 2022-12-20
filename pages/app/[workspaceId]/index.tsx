import { GetServerSideProps } from 'next'
import { RootHandler } from '../../../src/components/route/handlers/rootHandler'
import { setRoute } from '../../../src/routeComponents/route'

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
