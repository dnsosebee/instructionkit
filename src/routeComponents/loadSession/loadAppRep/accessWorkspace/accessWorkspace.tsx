import React, { useEffect, useState } from 'react'
import { ActionSubroute } from '../../../routeOld'
import { useAppRepCtx, UserInviteWorkspace, UserMembershipWorkspace } from '../loadAppRep'
import { LoadProjects, LoadProjectsSubroute } from './loadProjects/loadProjects'

export type AccessWorkspaceSubroute = ActionSubroute<{
  name: 'accessWorkspace'
  requiresInput: true
  subRoutes: [LoadProjectsSubroute]
}>
export type AccessFallbackWorkspaceSubroute = ActionSubroute<{
  name: 'accessFallbackWorkspace'
}>

type AccessWorkspaceContext = {
  userWorkspace: UserMembershipWorkspace | UserInviteWorkspace
  accessWorkspace: (workspaceId: string) => void
}

export const accessWorkspaceContext = React.createContext<AccessWorkspaceContext | null>(null)

type UserWorkspace = UserMembershipWorkspace | UserInviteWorkspace

type AccessWorkspaceState = {
  workspaceId: string
}

export const AccessWorkspace = ({
  route,
  fallback,
}: {
  route: AccessWorkspaceSubroute | AccessFallbackWorkspaceSubroute
  fallback: string
}) => {
  const { userMembershipWorkspaces, userInviteWorkspaces } = useAppRepCtx()

  useEffect(() => {
    if (route.do === 'accessFallbackWorkspace') {
      window.history.pushState({}, '', window.location.origin + '/v1/app/' + fallback)
    }
  }, [route.do])
  const [state, setState] = useState<AccessWorkspaceState>({
    workspaceId: route.do === 'accessWorkspace' ? route.withInput : fallback,
  })

  const getUserWorkspace = (workspaceId: string) => {
    return (
      userMembershipWorkspaces.find(ws => ws.workspace.id === workspaceId) ||
      userInviteWorkspaces.find(ws => ws.workspace.id === workspaceId)
    )
  }
  const userWorkspace = getUserWorkspace(state.workspaceId)

  const accessWorkspace = (workspaceId: string) => {
    window.history.pushState({}, '', window.location.origin + '/v1/app/' + workspaceId)
    setState({ workspaceId })
  }

  const nextRoute: AccessWorkspaceSubroute['then'] =
    route.do === 'accessWorkspace' ? route.then : { do: 'loadProjects' }

  return (
    <accessWorkspaceContext.Provider
      value={{
        userWorkspace: state.userWorkspace!,
        accessWorkspace,
      }}
    >
      <LoadProjects route={nextRoute} />
    </accessWorkspaceContext.Provider>
  )
}
