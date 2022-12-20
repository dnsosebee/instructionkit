import { useSnapshot } from 'valtio'
import {
  ForkSubrouteConfig,
  ForkType,
  globalRoute,
  ParamSubrouteConfig,
} from '../../../routeComponents/route'
import { FourOhFour } from '../../shared/404'
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
  const workspaceIdSnap = useSnapshot(globalRoute).state.params[WORKSPACE_ID_ROUTE_CONFIG.paramName]
  return (
    <WorkspaceRepProvider>
      <WorkspaceHandler />
    </WorkspaceRepProvider>
  )
}

const WorkspaceHandler = () => {
  const forkSnap = useSnapshot(globalRoute).state.forks[WORKSPACE_ROUTE_CONFIG.forkName]
  switch (forkSnap) {
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
