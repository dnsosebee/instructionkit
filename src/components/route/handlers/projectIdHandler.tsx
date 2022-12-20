import {
  ForkSubrouteConfig,
  ForkType,
  getRoute,
  ParamSubrouteConfig,
} from '../../../routeComponents/route'
import { FourOhFour } from '../../shared/404'
import { ProjectRepProvider } from '../providers/projectRepProvider'
import { WORKSPACE_ID_ROUTE_CONFIG } from './workspaceIdHandler'

const PROJECT_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'project',
  hasDefaultSubroute: true,
  namedSubroutes: {
    preview: {
      forkName: 'preview',
      hasDefaultSubroute: true,
    },
  },
}

export const PROJECT_ID_ROUTE_CONFIG: ParamSubrouteConfig = {
  paramName: 'projectId',
  subRoute: PROJECT_ROUTE_CONFIG,
}

export const ProjectIdHandler = () => {
  const params = getRoute().params
  return (
    <ProjectRepProvider
      workspaceId={params[WORKSPACE_ID_ROUTE_CONFIG.paramName]}
      projectId={params[PROJECT_ID_ROUTE_CONFIG.paramName]}
    >
      <ProjectHandler />
    </ProjectRepProvider>
  )
}

const ProjectHandler = () => {
  const projectFork = getRoute().forks[PROJECT_ROUTE_CONFIG.forkName]
  switch (projectFork) {
    case { type: ForkType.Default }:
      return <div>INSERT FLOWCHART PAGE HERE</div>
    case { type: ForkType.Named, urlSegment: 'preview' }:
      return <div>INSERT PREVIEW PAGE HERE</div>
    default:
      return <FourOhFour />
  }
}
