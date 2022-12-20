import { useSnapshot } from 'valtio'
import { ForkSubrouteConfig, ForkType, globalRoute, reroute } from '../../../routeComponents/route'
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
  const forkSnap = useSnapshot(globalRoute).state.forks[APP_ROUTE_CONFIG.forkName]
  switch (forkSnap) {
    case { type: ForkType.Default }:
      reroute(`/app/${defaultWorkspaceId}`)
      return null
    case { type: ForkType.Named, urlSegment: 'profile' }:
      return <div>INSERT PROFILE HERE</div>
    case { type: ForkType.Dynamic }:
      return <WorkspaceIdHandler />
    default:
      return <FourOhFour />
  }
}
