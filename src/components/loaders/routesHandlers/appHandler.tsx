import { ForkSubrouteConfig, ForkType, getRoute, setRoute } from '../../../lib/route'
import { FourOhFour } from '../../shared/FourOhFour'
import { useAppRepCtx } from '../providers/appRepProvider'
import { ProfileHandler, PROFILE_ROUTE_CONFIG } from './profileHandler'
import { WorkspaceIdHandler, WORKSPACE_ID_ROUTE_CONFIG } from './workspaceIdHandler'

export const APP_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'app',
  hasDefaultSubroute: true,
  namedSubroutes: {
    profile: PROFILE_ROUTE_CONFIG,
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
      return <ProfileHandler />
    case { type: ForkType.Dynamic }:
      return <WorkspaceIdHandler />
    default:
      return <FourOhFour />
  }
}
