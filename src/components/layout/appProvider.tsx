import { User } from '@supabase/auth-helpers-nextjs'
import { createContext, useContext, useState } from 'react'
import { useSubscribe } from 'replicache-react'
import { logger } from '../../logger'
import { AppRep as AppRepProvider, useAppRep } from '../../model/replicache-spaces/app/appMutators'
import { listInvites, RepInvite } from '../../model/replicache-spaces/app/keys/invite'
import { listMemberships, RepMembership } from '../../model/replicache-spaces/app/keys/membership'
import { listWorkspaces, RepWorkspace } from '../../model/replicache-spaces/app/keys/ws'
import Loading from '../shared/loading'
import Redirect from '../shared/redirect'
import { AppPage } from './appLayout'
import { useSupaAuthed } from './supaProvider'

export type AppContext = {
  workspace: RepWorkspace
  memberStatus: {
    // accessPolicy: 'owner' | 'member'
    acceptedInvite: boolean
  }
  appRep: AppRepProvider
  userInvites: RepInvite[]
  userMemberships: RepMembership[]
  userWorkspaces: RepWorkspace[]
  userInviteWorkspaces: RepWorkspace[]
  userWorkspacesAndInviteWorkspaces: RepWorkspace[]
  isSelectedWorkspace: (workspace: RepWorkspace) => boolean
}

const appContext = createContext<AppContext | null>(null)

export default (props: {
  workspaceId: string | null
  selectedPage: AppPage | null
  children: React.ReactNode
}) => {
  const { user } = useSupaAuthed()
  const appRep = useAppRep()
  if (!appRep) {
    return <Loading />
  }
  return <AppProvider {...{ ...props, appRep, user }} />
}

const AppProvider = ({
  workspaceId,
  selectedPage = null,
  children,
  appRep,
  user,
}: {
  workspaceId: string | null
  selectedPage: AppPage | null
  children: React.ReactNode
  appRep: AppRepProvider
  user: User
}) => {
  const [sync, setSync] = useState({
    started: false,
    done: false,
  })
  appRep.onSync = v => {
    if (v && !sync.started) {
      setSync(sync => ({ ...sync, started: true }))
    } else if (!v && !sync.done) {
      setSync(sync => ({ ...sync, done: true }))
    }
  }
  const memberships = useSubscribe(appRep, listMemberships, null, [appRep])
  const invites = useSubscribe(appRep, listInvites, null, [appRep])
  const workspaces = useSubscribe(appRep, listWorkspaces, null, [appRep])

  const doneSyncing = sync.started && sync.done
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
      logger.debug('user has no memberships and no invites, redirect to create workspace')
      return <Redirect to='/app/create-workspace' butOnlyIf={doneSyncing} />
    } else {
      if (!workspaceId) {
        logger.debug(
          'user has no memberships and no workspaceId is selected but has invites, redirect to the first invite',
        )
        return <Redirect to={`/app/${userInviteWorkspaces[0].id}`} butOnlyIf={doneSyncing} />
      }
    }
  } else {
    if (!workspaceId) {
      logger.debug(
        'user has memberships and no workspaceId is selected, redirect to the first membership',
      )
      return <Redirect to={`/app/${userWorkspaces[0].id}`} butOnlyIf={doneSyncing} />
    }
  }
  const workspace = userWorkspacesAndInviteWorkspaces.find(w => w.id === workspaceId)
  if (workspace === undefined) {
    logger.debug(
      `workspace with id ${workspaceId} not found among user's memberships, redirect to first workspace that exists (actually, just loading page for now)`,
    )
    // return <Loading />
    return (
      <Redirect to={`/app/${userWorkspacesAndInviteWorkspaces[0].id}`} butOnlyIf={doneSyncing} />
    )
  }

  // redirections for invites
  let acceptedInvite = true
  if (userInviteWorkspaces.some(w => w.id === workspaceId)) {
    acceptedInvite = false
    if (selectedPage !== AppPage.AcceptInvite) {
      logger.debug(
        'user has not accepted invite and is not on the accept-invite page, redirect to accept invite',
      )
      return <Redirect to={`/app/${workspaceId}/accept-invite`} butOnlyIf={doneSyncing} />
    }
  } else if (selectedPage === AppPage.AcceptInvite) {
    logger.debug('user has accepted invite and is on the accept-invite page, redirect to workspace')
    return <Redirect to={`/app/${workspaceId}`} butOnlyIf={doneSyncing} />
  }

  // redirections for setting workspace name
  if (workspace.name === '') {
    if (selectedPage !== AppPage.Settings) {
      logger.debug('workspace has no name and is not on the settings page, redirect to settings')
      return <Redirect to={`/app/${workspaceId}/settings`} butOnlyIf={doneSyncing} />
    }
  }

  const isSelectedWorkspace = (workspace: RepWorkspace) => {
    return workspaceId === workspace.id
  }

  const memberStatus = {
    acceptedInvite,
  }

  return (
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
        userMemberships,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

// assumptions for use: useSupaAuthed + user is member or invitee of the workspace (or is owner)
export const useAppContext = () => {
  const context = useContext(appContext)
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
