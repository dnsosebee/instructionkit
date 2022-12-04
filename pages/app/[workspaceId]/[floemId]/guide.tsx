// flowchart / guide page
import { GetServerSideProps } from 'next'
import { FloemInjector } from '../../../../src/components/floem/floem'
import { Guide } from '../../../../src/components/floem/guide/guide'
import AppProvider from '../../../../src/components/layout/appProvider'
import SupaProvider, { AuthState } from '../../../../src/components/layout/supaProvider'
import Loading from '../../../../src/components/shared/loading'
import UnableToLoad from '../../../../src/components/shared/unableToLoad'
import { useWorkspaceRep } from '../../../../src/model/replicache-spaces/ws-[id]/workspaceMutators'
import {
  getOrCreateWorkspaceSpace,
  WorkspaceIdIfExists,
} from '../../../../src/server/getOrCreateWorkspaceSpace'

export const getServerSideProps: GetServerSideProps = async context => {
  const { floemId } = context.query
  const workspaceProps = await getOrCreateWorkspaceSpace(context)
  if ('redirect' in workspaceProps || 'notFound' in workspaceProps) {
    return workspaceProps
  }
  return {
    props: {
      ...workspaceProps.props,
      floemId,
    },
  }
}

export default ({ workspaceId, floemId }: WorkspaceIdIfExists & { floemId: string }) => {
  if (!workspaceId) {
    return <UnableToLoad reason='Workspace not found' />
  }

  return <GuidePage {...{ workspaceId, floemId }} />
}

const GuidePage = ({ workspaceId, floemId }: { workspaceId: string; floemId: string }) => {
  const workspaceRep = useWorkspaceRep(workspaceId)
  if (!workspaceRep) {
    return <Loading />
  }

  return (
    <SupaProvider intendedAuthState={AuthState.SignedIn}>
      <AppProvider workspaceId={workspaceId} selectedPage={null}>
        <FloemInjector rep={workspaceRep} id={floemId} view={Guide} />
      </AppProvider>
    </SupaProvider>
  )
}
