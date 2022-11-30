import { useEffect, useState } from 'react'
import AppProvider, { useAppContext } from '../../src/components/layout/appProvider'
import SupaProvider, { AuthState, useSupaAuthed } from '../../src/components/layout/supaProvider'
import Redirect from '../../src/components/shared/redirect'
import { genWorkspaceId } from '../../src/model/replicache-spaces/ws-[id]/workspaceMutators'

export default () => {
  return (
    <SupaProvider intendedAuthState={AuthState.SignedIn}>
      <AppProvider workspaceId={null} selectedPage={null}>
        <CreateWorkspace />
      </AppProvider>
    </SupaProvider>
  )
}

export const CreateWorkspace = () => {
  const { user } = useSupaAuthed()
  const { appRep } = useAppContext()
  const [resolvedNewWorkspaceId, setResolvedNewWorkspaceId] = useState<string | null>(null)
  useEffect(() => {
    const create = async () => {
      const newWorkspaceId = genWorkspaceId()

      await appRep.mutate.createWorkspaceWithOwner({
        workspace: {
          id: newWorkspaceId,
          name: '',
          icon: '',
          createdAt: Date.now(),
        },
        userId: user.id,
      })

      // see whether successful
      fetch(`/api/replicache/create-workspace?workspaceId=${newWorkspaceId}`).then(res =>
        res.json(),
      )

      setResolvedNewWorkspaceId(newWorkspaceId)
    }
    create()
  }, [appRep, user.id])

  // redirect to the new workspace
  return <Redirect to={`/app/${resolvedNewWorkspaceId}/settings`} />
}
