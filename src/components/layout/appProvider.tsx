import { createContext, useContext } from 'react'
import { useSubscribe } from 'replicache-react'
import { AppRep, useAppReplicache } from '../../model/replicache-spaces/app/appMutators'
import { listInvites, RepInvite } from '../../model/replicache-spaces/app/types/invite'
import { listMemberships } from '../../model/replicache-spaces/app/types/membership'
import { listWorkspaces, RepWorkspace } from '../../model/replicache-spaces/app/types/workspace'
import Loading from '../shared/loading'
import Redirect from '../shared/redirect'
import { AppPage } from './appLayout'
import SupaProvider, { AuthState, useSupaAuthed } from './supaProvider'

export type AppContext = {
  workspace: RepWorkspace
  memberStatus: {
    // accessPolicy: 'owner' | 'member'
    acceptedInvite: boolean
  }
  appRep: AppRep
  userInvites: RepInvite[]
  userWorkspaces: RepWorkspace[]
  userInviteWorkspaces: RepWorkspace[]
  userWorkspacesAndInviteWorkspaces: RepWorkspace[]
  isSelectedWorkspace: (workspace: RepWorkspace) => boolean
}

const appContext = createContext<AppContext | null>(null)

export default ({
  workspaceId,
  selectedPage = null,
  children,
}: {
  workspaceId: string | null
  selectedPage: AppPage | null
  children: React.ReactNode
}) => {
  const { user } = useSupaAuthed()
  const appRep = useAppReplicache()
  if (!appRep) {
    return <Loading />
  }

  const memberships = useSubscribe(appRep, listMemberships, null, [appRep])
  const invites = useSubscribe(appRep, listInvites, null, [appRep])
  const workspaces = useSubscribe(appRep, listWorkspaces, null, [appRep])

  if (!workspaces || !memberships || !invites) {
    return <Loading />
  }

  const userMemberships = memberships.filter(m => m.userId === user.id)
  const userWorkspaces = workspaces.filter(w => userMemberships.some(m => m.workspaceId === w.id))
  const userInvites = invites.filter(i => i.email === user.email)
  const userInviteWorkspaces = workspaces.filter(w => userInvites.some(i => i.workspaceId === w.id))
  const userWorkspacesAndInviteWorkspaces = userWorkspaces.concat(userInviteWorkspaces)

  // routing
  if (!userWorkspaces.length) {
    if (!userInviteWorkspaces.length) {
      return <Redirect to='/app/create-workspace' />
    } else {
      if (!workspaceId) {
        return <Redirect to={`/app/${userInviteWorkspaces[0].id}`} />
      }
    }
  } else {
    if (!workspaceId) {
      return <Redirect to={`/app/${userWorkspaces[0].id}`} />
    }
  }
  const workspace = userWorkspacesAndInviteWorkspaces.find(w => w.id === workspaceId)
  if (workspace === undefined) {
    return <Redirect to={`/app/${userWorkspacesAndInviteWorkspaces[0].id}`} />
  }
  let acceptedInvite = true
  if (userInviteWorkspaces.some(w => w.id === workspaceId)) {
    acceptedInvite = false
    if (selectedPage !== AppPage.AcceptInvite) {
      return <Redirect to={`/app/${workspaceId}/accept-invite`} />
    }
  } else if (selectedPage === AppPage.AcceptInvite) {
    return <Redirect to={`/app/${workspaceId}`} />
  }

  const isSelectedWorkspace = (workspace: RepWorkspace) => {
    return workspaceId === workspace.id
  }

  const memberStatus = {
    acceptedInvite,
  }

  return (
    <SupaProvider intendedAuthState={AuthState.SignedIn}>
      <appContext.Provider
        value={{
          workspace,
          memberStatus,
          appRep,
          userInvites,
          isSelectedWorkspace,
          userWorkspacesAndInviteWorkspaces,
          userWorkspaces,
          userInviteWorkspaces,
        }}
      >
        {children}
      </appContext.Provider>
    </SupaProvider>
  )
}

export const useAppContext = () => {
  const context = useContext(appContext)
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
