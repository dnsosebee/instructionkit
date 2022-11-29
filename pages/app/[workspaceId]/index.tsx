import { GetServerSideProps } from 'next'
import AppLayout from '../../../src/components/layout/appLayout'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  return {
    props: {
      workspaceId,
    },
  }
}

export default ({ workspaceId }: { workspaceId: string }) => {
  return (
    <AppLayout selectedWorkspaceId={workspaceId}>
      <p>This is the projects page. Workspace ID: {workspaceId}</p>
    </AppLayout>
  )
}
