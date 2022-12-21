import { ForkSubrouteConfig, ForkType, getRoute, ParamSubrouteConfig } from '../../../lib/route'
import { FourOhFour } from '../../views/shared/FourOhFour'
import { useAppRepCtx } from '../providers/appRepProvider'
import { WorkspaceRepProvider } from '../providers/workspaceRepProvider'
import { ProjectIdHandler, PROJECT_ID_ROUTE_CONFIG } from './projectHandler'

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
  subRoute: WORKSPACE_ROUTE_CONFIG,
}

export const WorkspaceIdHandler = () => {
  const workspaceId = getRoute().params[WORKSPACE_ID_ROUTE_CONFIG.paramName]
  const { userMembershipWorkspaces, userInviteWorkspaces } = useAppRepCtx()
  if (
    !(
      userInviteWorkspaces.find(v => v.workspace.id === workspaceId) ||
      userMembershipWorkspaces.find(v => v.workspace.id === workspaceId)
    )
  ) {
    return (
      <FourOhFour
        errorMessage={`user is not a member nor invitee of workspace with id '${workspaceId}'`}
      />
    )
  }

  return (
    <WorkspaceRepProvider workspaceId={workspaceId}>
      <WorkspaceHandler />
    </WorkspaceRepProvider>
  )
}

const WorkspaceHandler = () => {
  const workspaceFork = getRoute().forks[WORKSPACE_ROUTE_CONFIG.forkName]
  switch (workspaceFork.type) {
    case ForkType.Default:
      return <div>INSERT WORKSPACE PROJECTS PAGE HERE</div>
    case ForkType.Named:
      switch (workspaceFork.urlSegment) {
        case 'settings':
          return <div>INSERT WORKSPACE SETTINGS PAGE HERE</div>
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
