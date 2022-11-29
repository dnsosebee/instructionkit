import { GetServerSideProps } from 'next'
import { createSpace, spaceExists } from 'replicache-nextjs/lib/backend'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { Dashboard } from '../../../src/components/dashboard/dashboard'
import AppLayout, { AppPage } from '../../../src/components/layout/appLayout'
import { floemMutators } from '../../../src/model/replicache/space-workspace-[id]/mutators'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  if (!(await spaceExists(workspaceId))) {
    await createSpace(workspaceId)
  }
  return {
    props: {
      workspaceId,
    },
  }
}

export default ({ workspaceId }: { workspaceId: string }) => {
  return (
    <AppLayout selectedWorkspaceId={workspaceId} selectedPage={AppPage.Projects}>
      <Dash workspaceId={workspaceId} />
    </AppLayout>
  )
}

const Dash = ({ workspaceId }: { workspaceId: string }) => {
  const rep = useReplicache({ name: workspaceId, mutators: floemMutators })

  if (!rep) {
    return null
  }

  return <Dashboard rep={rep} />
}
