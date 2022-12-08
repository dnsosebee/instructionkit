import { GetServerSideProps } from 'next'
import { Dashboard } from '../../../src/components/dashboard/dashboard'
import AppLayout, { AppPage } from '../../../src/components/layout/appLayout'
import Loading from '../../../src/components/shared/loading'
import UnableToLoad from '../../../src/components/shared/unableToLoad'
import { useWorkspaceRep } from '../../../src/model/replicache-spaces/proj-[id]/projMutators'
import {
  getOrCreateWorkspaceSpace,
  WorkspaceIdIfExists,
} from '../../../src/server/getOrCreateWorkspaceSpace'

export const getServerSideProps: GetServerSideProps = getOrCreateWorkspaceSpace

export default ({ workspaceId }: WorkspaceIdIfExists) => {
  if (!workspaceId) {
    return <UnableToLoad reason='Workspace not found' />
  }
  return (
    <AppLayout workspaceId={workspaceId} selectedPage={AppPage.Projects}>
      <Dash workspaceId={workspaceId} />
    </AppLayout>
  )
}

const Dash = ({ workspaceId }: { workspaceId: string }) => {
  const workspaceRep = useWorkspaceRep(workspaceId)
  if (!workspaceRep) {
    return <Loading />
  }
  return <Dashboard rep={workspaceRep} />
}
