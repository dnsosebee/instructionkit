import { WorkspaceView } from '../../../../pages/[workspaceId]'
import { SettingsView } from '../../../../pages/[workspaceId]/settings'
import {
  ForkSubrouteConfig,
  ForkType,
  getRoute,
  ParamSubrouteConfig,
} from '../../../lib/route/route'
import { AcceptInvite } from '../../views/app/acceptInvite'
import { FourOhFour } from '../../views/shared/FourOhFour'
import { useAppCtx } from '../providers/appProvider'
import { WorkspaceProvider } from '../providers/workspaceProvider'
import { ProjectIdHandler, PROJECT_ID_ROUTE_CONFIG } from './projectHandler'

export const WORKSPACE_HREF = (workspaceId: string) => `/${workspaceId}`
export const WORKSPACE_SETTINGS_HREF = (workspaceId: string) =>
  `${WORKSPACE_HREF(workspaceId)}/settings`

const WORKSPACE_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'workspace',
  hasDefaultSubroute: true,
  namedSubroutes: {
    settings: {
      forkName: 'settings',
      hasDefaultSubroute: true,
    },
  },
  dynamicSubroute: PROJECT_ID_ROUTE_CONFIG,
}

export const WORKSPACE_ID_ROUTE_CONFIG: ParamSubrouteConfig = {
  paramName: 'workspaceId',
  subroute: WORKSPACE_ROUTE_CONFIG,
}

export const WorkspaceIdHandler = () => {
  const workspaceId = getRoute().params[WORKSPACE_ID_ROUTE_CONFIG.paramName]
  const { userMembershipWorkspaces, userInviteWorkspaces } = useAppCtx()
  if (userInviteWorkspaces.find(v => v.workspace.id === workspaceId)) {
    return <AcceptInvite />
  } else if (userMembershipWorkspaces.find(v => v.workspace.id === workspaceId)) {
    return (
      <WorkspaceProvider workspaceId={workspaceId}>
        <WorkspaceHandler />
      </WorkspaceProvider>
    )
  }
  return (
    <FourOhFour
      errorMessage={`user is not a member nor invitee of workspace with id '${workspaceId}'`}
    />
  )
}

const WorkspaceHandler = () => {
  const workspaceFork = getRoute().forks[WORKSPACE_ROUTE_CONFIG.forkName]
  switch (workspaceFork.type) {
    case ForkType.Default:
      return <WorkspaceView />
    case ForkType.Named:
      switch (workspaceFork.urlSegment) {
        case 'settings':
          return <SettingsView />
        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${workspaceFork.urlSegment}' in workspace fork`}
            />
          )
      }
    case ForkType.Dynamic:
      return <ProjectIdHandler />
  }
}
