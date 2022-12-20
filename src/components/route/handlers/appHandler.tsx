import { ForkSubrouteConfig, ForkType, getRoute, setRoute } from '../../../routeComponents/route'
import { FourOhFour } from '../../shared/404'
import { useAppRepCtx } from '../providers/appRepProvider'
import { WorkspaceIdHandler, WORKSPACE_ID_ROUTE_CONFIG } from './workspaceIdHandler'

export const APP_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'app',
  hasDefaultSubroute: true,
  namedSubroutes: {
    profile: {
      forkName: 'profile',
      hasDefaultSubroute: true,
    },
  },
  dynamicSubroute: WORKSPACE_ID_ROUTE_CONFIG,
}

export const AppHandler = () => {
  const { defaultWorkspaceId } = useAppRepCtx()
  const appFork = getRoute().forks[APP_ROUTE_CONFIG.forkName]
  switch (appFork) {
    case { type: ForkType.Default }:
      setRoute({ route: `/app/${defaultWorkspaceId}`, replace: true })
      return null
    case { type: ForkType.Named, urlSegment: 'profile' }:
      return <div>INSERT PROFILE HERE</div>
    case { type: ForkType.Dynamic }:
      return <WorkspaceIdHandler />
    default:
      return <FourOhFour />
  }
}
