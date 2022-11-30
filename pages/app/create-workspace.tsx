import { useEffect, useState } from 'react'
import AppProvider, { useAppContext } from '../../src/components/layout/appProvider'
import { useSupaAuthed } from '../../src/components/layout/supaProvider'
import Redirect from '../../src/components/shared/redirect'
import { genWorkspaceId } from '../../src/model/replicache-spaces/workspace-[id]/mutators'

export default () => {
  return (
    <AppProvider workspaceId={null} selectedPage={null}>
      <CreateWorkspace />
    </AppProvider>
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

      setResolvedNewWorkspaceId(newWorkspaceId)
    }
    create()
  }, [appRep, user.id])

  // redirect to the new workspace
  return <Redirect to={`/app/${resolvedNewWorkspaceId}/settings`} />
}
