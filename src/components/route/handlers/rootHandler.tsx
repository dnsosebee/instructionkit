import { ForkSubrouteConfig, ForkType, getRoute } from '../../../routeComponents/route'
import { FourOhFour } from '../../shared/404'
import { AppRepProvider } from '../providers/appRepProvider'
import { SessionProvider } from '../providers/sessionProvider/sessionProvider'
import { AppHandler, APP_ROUTE_CONFIG } from './appHandler'

export const ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'root',
  hasDefaultSubroute: true,
  namedSubroutes: {
    app: APP_ROUTE_CONFIG,
  },
}

export const RootHandler = () => {
  const rootFork = getRoute().forks[ROUTE_CONFIG.forkName]
  switch (rootFork) {
    case { type: ForkType.Default }:
      return <div>INSERT LANDING PAGE HERE</div>
    case { type: ForkType.Named, urlSegment: 'app' }:
      return (
        <SessionProvider>
          <AppRepProvider>
            <AppHandler />
          </AppRepProvider>
        </SessionProvider>
      )
    default:
      return <FourOhFour />
  }
}
