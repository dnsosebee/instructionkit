import React, { useEffect, useState } from 'react'
import { useSubscribe } from 'replicache-react'
import Loading from '../../../components/shared/loading'
import { AppRep, useAppRep } from '../../../model/replicache/spaces/app/appMutators'
import { listInvites, RepInvite } from '../../../model/replicache/spaces/app/entries/inv'
import { listMemberships, RepMembership } from '../../../model/replicache/spaces/app/entries/member'
import {
  genWorkspaceId,
  listWorkspaces,
  RepWorkspace,
} from '../../../model/replicache/spaces/app/entries/ws'
import { ActionSubroute } from '../../route'
import { useSessionCtx } from '../loadSession'
import {
  AccessFallbackWorkspaceSubroute,
  AccessWorkspace,
  AccessWorkspaceSubroute,
} from './accessWorkspace/accessWorkspace'

export type LoadAppRepSubroute = ActionSubroute<{
  name: 'loadAppRep'
  subRoutes: [AccessWorkspaceSubroute, AccessFallbackWorkspaceSubroute]
}>

type AppRepContext = {
  appRep: AppRep
  userInviteWorkspaces: UserInviteWorkspace[]
  userMembershipWorkspaces: UserMembershipWorkspace[]
  fallbackWorkspace: string | null
  createWorkspace: () => void
}

export const appRepContext = React.createContext<AppRepContext | null>(null)

export const LoadAppRep = ({ route }: { route: LoadAppRepSubroute }) => {
  const appRep = useAppRep()
  if (!appRep) {
    return <Loading />
  }
  return <LoadAppRep2 route={route} appRep={appRep} />
}

export type UserInviteWorkspace = {
  invite: RepInvite
  workspace: RepWorkspace
}

export type UserMembershipWorkspace = {
  membership: RepMembership
  workspace: RepWorkspace
}

// TODO: should probably have some more accurate list subscriptions functions
// This approach relies on syncing, which is unreliable
const LoadAppRep2 = ({ route, appRep }: { appRep: AppRep; route: LoadAppRepSubroute }) => {
  const userInvites = useSubscribe(appRep, listInvites, null, [appRep])
  const userMemberships = useSubscribe(appRep, listMemberships, null, [appRep])
  const workspaces = useSubscribe(appRep, listWorkspaces, null, [appRep])
  if (!userInvites || !userMemberships || !workspaces) {
    return <Loading />
  }
  return (
    <LoadAppRep3
      route={route}
      appRep={appRep}
      userInvites={userInvites}
      userMemberships={userMemberships}
      workspaces={workspaces}
    />
  )
}

const LoadAppRep3 = ({
  route,
  appRep,
  userInvites,
  userMemberships,
  workspaces,
}: {
  appRep: AppRep
  route: LoadAppRepSubroute
  userInvites: RepInvite[]
  userMemberships: RepMembership[]
  workspaces: RepWorkspace[]
}) => {
  const { session } = useSessionCtx()

  const [fallback, setFallback] = useState<string | null>(null)

  const userInviteWorkspaces = userInvites.map(invite => {
    const workspace = workspaces.find(ws => ws.id === invite.workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    return { invite, workspace }
  })
  const userMembershipWorkspaces = userMemberships.map(membership => {
    const workspace = workspaces.find(ws => ws.id === membership.workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    return { membership, workspace }
  })
  const createWorkspace = async () => {
    if (fallback) {
      setFallback(null)
    }
    const workspaceId = genWorkspaceId()
    await appRep.mutate.createWorkspaceWithOwner({
      workspace: {
        id: workspaceId,
        name: 'New Workspace',
        icon: 'folder',
        createdAt: Date.now(),
      },
      userId: session.user.id,
    })
    // we expect this to trigger the effect below, which will set the fallback
  }

  // create a workspace whenever we don't have one
  useEffect(() => {
    if (userInviteWorkspaces.length === 0 && userMembershipWorkspaces.length === 0) {
      createWorkspace()
    } else if (userInviteWorkspaces.length > 0) {
      setFallback(userInviteWorkspaces[0].workspace.id)
    } else if (userMembershipWorkspaces.length > 0) {
      setFallback(userMembershipWorkspaces[0].workspace.id)
    }
  }, [userInviteWorkspaces.length, userMembershipWorkspaces.length])

  if (!fallback) {
    return <Loading />
  }
  return (
    <appRepContext.Provider
      value={{
        appRep,
        userInviteWorkspaces,
        userMembershipWorkspaces,
        fallbackWorkspace: fallback,
        createWorkspace,
      }}
    >
      <AccessWorkspace route={route.then} fallback={fallback} />
    </appRepContext.Provider>
  )
}

export const useAppRepCtx = () => {
  const ctx = React.useContext(appRepContext)
  if (!ctx) {
    throw new Error('useAppRepCtx must be used beneath the loadAppRep route component')
  }
  return ctx
}
