import { GetServerSideProps } from 'next'
import AppLayout from '../../../src/components/layout/appLayout'
import { logger } from '../../../src/logger'

// get workspaceId from routes
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  return {
    props: {
      workspaceId,
    },
  }
}

export default ({ workspaceId }: { workspaceId: string }) => {
  logger.debug('workspaceId', workspaceId)
  return (
    <AppLayout selectedWorkspaceId={workspaceId}>
      <p>This is the settings page. Workspace ID: {workspaceId}</p>
    </AppLayout>
  )
}
