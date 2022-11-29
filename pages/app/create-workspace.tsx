import { User } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@supabase/auth-helpers-react'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { appMutators, AppRep, APP_SPACE_ID } from '../../src/model/replicache/space-app/appMutators'
import { genWorkspaceId } from '../../src/model/replicache/space-workspace-[id]/mutators'

export default () => {
  const appRep = useReplicache({ name: APP_SPACE_ID, mutators: appMutators })
  const user = useUser()
  if (!appRep || !user) {
    return null
  }
  return <CreateWorkspace appRep={appRep} user={user} />
}

export const CreateWorkspace = ({ appRep, user }: { appRep: AppRep; user: User }) => {
  const newWorkspaceId = genWorkspaceId()
  appRep.mutate.createWorkspace({
    id: newWorkspaceId,
    name: '',
    icon: '',
    createdAt: Date.now(),
  })
  appRep.mutate.createOrUpdateMembership({
    userId: user.id,
    workspaceId: newWorkspaceId,
    accessPolicy: 'owner',
  })
  // redirect to the new workspace
  window.location.href = `/app/${newWorkspaceId}/settings`
  return null
}
