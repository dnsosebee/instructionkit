import { useSnapshot } from 'valtio'
import {
  ForkSubrouteConfig,
  ForkType,
  globalRoute,
  ParamSubrouteConfig,
} from '../../../routeComponents/route'
import { FourOhFour } from '../../shared/404'

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
  const projectIdSnap = useSnapshot(globalRoute).state.params[PROJECT_ID_ROUTE_CONFIG.paramName]
  return <div>App</div>
}

const ProjectHandler = () => {
  const forkSnap = useSnapshot(globalRoute).state.forks[PROJECT_ROUTE_CONFIG.forkName]
  switch (forkSnap) {
    case { type: ForkType.Default }:
      return <div>INSERT FLOWCHART PAGE HERE</div>
    case { type: ForkType.Named, urlSegment: 'preview' }:
      return <div>INSERT PREVIEW PAGE HERE</div>
    default:
      return <FourOhFour />
  }
}
