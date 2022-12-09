import { useEffect, useState } from 'react'
import SupaProvider, { AuthState, useSupaAuthed } from '../../src/components/layout/supaProvider'
import Loading from '../../src/components/shared/loading'
import Redirect from '../../src/components/shared/redirect'
import { logger } from '../../src/logger'
import { AppRep, useAppRep } from '../../src/model/replicache/spaces/app/appMutators'
import { genWorkspaceId } from '../../src/model/replicache/spaces/proj-[id]/projectMutators'

export default () => {
  const appRep = useAppRep()
  if (!appRep) {
    return <Loading />
  }
  return (
    <SupaProvider intendedAuthState={AuthState.SignedIn}>
      <CreateWorkspace {...{ appRep }} />
    </SupaProvider>
  )
}

export const CreateWorkspace = ({ appRep }: { appRep: AppRep }) => {
  logger.debug('CreateWorkspace')
  const { user } = useSupaAuthed()

  const [resolvedNewWorkspaceId, setResolvedNewWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    const create = async () => {
      const newWorkspaceId = genWorkspaceId()
      await appRep.mutate.createWorkspaceWithOwner({
        workspace: {
          id: newWorkspaceId,
          name: 'New Workspace',
          icon: 'folder',
          createdAt: Date.now(),
        },
        userId: user.id,
      })
      setResolvedNewWorkspaceId(newWorkspaceId)
    }
    create()
  }, [])

  if (!resolvedNewWorkspaceId) {
    return <Loading />
  }

  return <Redirect to={`/app/${resolvedNewWorkspaceId}/settings`} />
}
