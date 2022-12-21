import React, { useEffect, useState } from 'react'
import { useSubscribe } from 'replicache-react'
import { logger as parentLogger } from '../../../lib/logger'
import { createWorkspaceRepHelper } from '../../../model/replicache/createRepHelper'
import { AppRep, useAppRep } from '../../../model/replicache/spaces/app/appMutators'
import { listInvites, RepInvite } from '../../../model/replicache/spaces/app/entries/inv'
import { listMemberships, RepMembership } from '../../../model/replicache/spaces/app/entries/member'
import {
  genWorkspaceId,
  listWorkspaces,
  RepWorkspace,
} from '../../../model/replicache/spaces/app/entries/ws'
import Loading from '../../views/shared/loading'
import { useSessionCtx } from './sessionProvider/sessionProvider'

const logger = parentLogger.child({ component: 'appRepProvider' })

type AppRepContext = {
  appRep: AppRep
  userInviteWorkspaces: UserInviteWorkspace[]
  userMembershipWorkspaces: UserMembershipWorkspace[]
  defaultWorkspaceId: string | null
  createWorkspace: () => Promise<string>
}

export const appRepContext = React.createContext<AppRepContext | null>(null)

export const AppRepProvider = ({ children }: { children: React.ReactNode }) => {
  const appRep = useAppRep()
  if (!appRep) {
    return <Loading />
  }
  return <InnerAppRepProvider appRep={appRep}>{children}</InnerAppRepProvider>
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
const InnerAppRepProvider = ({
  appRep,
  children,
}: {
  appRep: AppRep
  children: React.ReactNode
}) => {
  const userInvites = useSubscribe(appRep, listInvites, null, [appRep])
  const userMemberships = useSubscribe(appRep, listMemberships, null, [appRep])
  const workspaces = useSubscribe(appRep, listWorkspaces, null, [appRep])
  if (!userInvites || !userMemberships || !workspaces) {
    return <Loading />
  }
  return (
    <InnerAppRepProvider2
      appRep={appRep}
      userInvites={userInvites}
      userMemberships={userMemberships}
      workspaces={workspaces}
    >
      {children}
    </InnerAppRepProvider2>
  )
}

const InnerAppRepProvider2 = ({
  children,
  appRep,
  userInvites,
  userMemberships,
  workspaces,
}: {
  children: React.ReactNode
  appRep: AppRep
  userInvites: RepInvite[]
  userMemberships: RepMembership[]
  workspaces: RepWorkspace[]
}) => {
  const { session } = useSessionCtx()

  const [defaultWorkspaceId, setDefaultWorkspaceId] = useState<string | null>(null)

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
  const createWorkspace = async (): Promise<string> => {
    if (defaultWorkspaceId) {
      setDefaultWorkspaceId(null)
    }
    const workspaceId = genWorkspaceId()
    logger.debug('Creating workspace', { workspaceId })
    // we expect the mutation below to trigger the effect below, which will set the fallback
    createWorkspaceRepHelper({ appRep, workspaceId, userId: session.user.id })
    return workspaceId
    // await appRep.mutate.createWorkspaceWithOwner({
    //   workspace: {
    //     id: workspaceId,
    //     name: 'New Workspace',
    //     icon: 'folder',
    //     createdAt: Date.now(),
    //   },
    //   userId: session.user.id,
    // })
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
    <appRepContext.Provider
      value={{
        appRep,
        userInviteWorkspaces,
        userMembershipWorkspaces,
        defaultWorkspaceId: defaultWorkspaceId,
        createWorkspace,
      }}
    >
      {children}
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
