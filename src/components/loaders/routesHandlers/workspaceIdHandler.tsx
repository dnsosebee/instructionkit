import { ForkSubrouteConfig, ForkType, getRoute, ParamSubrouteConfig } from '../../../lib/route'
import { FourOhFour } from '../../shared/FourOhFour'
import { WorkspaceRepProvider } from '../providers/workspaceRepProvider'
import { ProjectIdHandler, PROJECT_ID_ROUTE_CONFIG } from './projectIdHandler'

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
  return (
    <WorkspaceRepProvider workspaceId={workspaceId}>
      <WorkspaceHandler />
    </WorkspaceRepProvider>
  )
}

const WorkspaceHandler = () => {
  const workspaceFork = getRoute().forks[WORKSPACE_ROUTE_CONFIG.forkName]
  switch (workspaceFork) {
    case { type: ForkType.Default }:
      return <div>INSERT WORKSPACE PROJECTS PAGE HERE</div>
    case { type: ForkType.Named, urlSegment: 'settings' }:
      return <div>INSERT WORKSPACE SETTINGS PAGE HERE</div>
    case { type: ForkType.Dynamic }:
      return <ProjectIdHandler />
    default:
      return <FourOhFour />
  }
}
