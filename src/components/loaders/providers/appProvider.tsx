import React, { useEffect, useState } from 'react'
import { useSubscribe } from 'replicache-react'
import { logger as parentLogger } from '../../../lib/logger'
import { setRoute } from '../../../lib/route/route'
import { createWorkspaceSpaceHelper } from '../../../model/persistence/replicache/createSpace/createSpaceHelper'
import { AppRep, useAppRep } from '../../../model/persistence/replicache/spaces/app/appRep'
import { listInvites } from '../../../model/persistence/replicache/spaces/app/entries/inv'
import { listMemberships } from '../../../model/persistence/replicache/spaces/app/entries/member'
import { listWorkspaces } from '../../../model/persistence/replicache/spaces/app/entries/ws'
import { Invite } from '../../../model/schema/types/invite'
import { Membership } from '../../../model/schema/types/membership'
import { genWorkspaceId, Workspace } from '../../../model/schema/types/workspace'

import Loading from '../../views/shared/loading'
import { ROOT_HREF } from '../routeHandlers/rootHandler'
import { WORKSPACE_SETTINGS_HREF } from '../routeHandlers/workspaceHandler'
import { useSessionCtx } from './sessionProvider/sessionProvider'

const logger = parentLogger.child({ component: 'appProvider' })

type AppContext = {
  appRep: AppRep
  userInviteWorkspaces: UserInviteWorkspace[]
  userMembershipWorkspaces: UserMembershipWorkspace[]
  defaultWorkspaceId: string | null
  createWorkspace: () => Promise<void>
  declineInvite: (invite: Invite) => Promise<void>
  deleteMembership: (membership: Membership) => Promise<void>
  deleteWorkspace: (workspaceId: string) => Promise<void>
}

export const appContext = React.createContext<AppContext | null>(null)

export const useAppCtx = () => {
  const ctx = React.useContext(appContext)
  if (!ctx) {
    throw new Error('useAppCtx must be used within an AppProvider')
  }
  return ctx
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const appRep = useAppRep()
  if (!appRep) {
    return <Loading />
  }
  return <InnerAppProvider appRep={appRep}>{children}</InnerAppProvider>
}

export type UserInviteWorkspace = {
  invite: Invite
  workspace: Workspace
}

export type UserMembershipWorkspace = {
  membership: Membership
  workspace: Workspace
}

// TODO: should probably have some more accurate list subscriptions functions
// This approach relies on syncing, which is unreliable
const InnerAppProvider = ({ appRep, children }: { appRep: AppRep; children: React.ReactNode }) => {
  const invites = useSubscribe(appRep, listInvites, null, [appRep])
  const memberships = useSubscribe(appRep, listMemberships, null, [appRep])
  const workspaces = useSubscribe(appRep, listWorkspaces, null, [appRep])
  if (!invites || !memberships || !workspaces) {
    return <Loading />
  }
  return (
    <InnerAppProvider2
      appRep={appRep}
      invites={invites}
      memberships={memberships}
      workspaces={workspaces}
    >
      {children}
    </InnerAppProvider2>
  )
}

const InnerAppProvider2 = ({
  children,
  appRep,
  invites,
  memberships,
  workspaces,
}: {
  children: React.ReactNode
  appRep: AppRep
  invites: Invite[]
  memberships: Membership[]
  workspaces: Workspace[]
}) => {
  const { session } = useSessionCtx()

  const [defaultWorkspaceId, setDefaultWorkspaceId] = useState<string | null>(null)

  const userInviteWorkspaces = invites.reduce((acc, invite) => {
    if (!(invite.email === session.user.email)) {
      return acc
    }
    const workspace = workspaces.find(ws => ws.id === invite.workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    return [...acc, { invite, workspace }]
  }, [] as UserInviteWorkspace[])

  const userMembershipWorkspaces = memberships.reduce((acc, membership) => {
    if (!(membership.userId === session.user.id)) {
      return acc
    }
    const workspace = workspaces.find(ws => ws.id === membership.workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    return [...acc, { membership, workspace }]
  }, [] as UserMembershipWorkspace[])

  // the following functions are at this level because they have a dependency on defaultWorkspaceId
  const createWorkspace = async () => {
    if (defaultWorkspaceId) {
      setDefaultWorkspaceId(null) // loading mode
    }
    const workspaceId = genWorkspaceId()
    logger.debug('Creating workspace', { workspaceId })
    await createWorkspaceSpaceHelper({ appRep, workspaceId, userId: session.user.id })
    setRoute({ route: WORKSPACE_SETTINGS_HREF(workspaceId), action: 'push' })
  }

  const declineInvite = async (invite: Invite) => {
    if (defaultWorkspaceId) {
      setDefaultWorkspaceId(null) // loading mode
    }
    await appRep.mutate.deleteInvite(invite)
    setRoute({ route: ROOT_HREF, action: 'push' })
  }

  const deleteMembership = async (membership: Membership) => {
    if (defaultWorkspaceId) {
      setDefaultWorkspaceId(null) // loading mode
    }
    await appRep.mutate.deleteMembership(membership)
    setRoute({ route: ROOT_HREF, action: 'push' })
  }

  const deleteWorkspace = async (workspaceId: string) => {
    if (defaultWorkspaceId) {
      setDefaultWorkspaceId(null) // loading mode
    }
    await appRep.mutate.deleteWorkspace(workspaceId)
    setRoute({ route: ROOT_HREF, action: 'push' })
  }

  // create a workspace whenever we don't have one
  useEffect(() => {
    if (userInviteWorkspaces.length === 0 && userMembershipWorkspaces.length === 0) {
      createWorkspace()
    } else if (userInviteWorkspaces.length > 0) {
      setDefaultWorkspaceId(userInviteWorkspaces[0].workspace.id)
    } else if (userMembershipWorkspaces.length > 0) {
      setDefaultWorkspaceId(userMembershipWorkspaces[0].workspace.id)
    }
  }, [userInviteWorkspaces.length, userMembershipWorkspaces.length])

  if (!defaultWorkspaceId) {
    return <Loading />
  }
  return (
    <appContext.Provider
      value={{
        appRep,
        userInviteWorkspaces,
        userMembershipWorkspaces,
        defaultWorkspaceId,
        createWorkspace,
        declineInvite,
        deleteMembership,
        deleteWorkspace,
      }}
    >
      {children}
    </appContext.Provider>
  )
}
