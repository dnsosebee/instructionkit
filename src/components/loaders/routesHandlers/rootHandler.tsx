import { ForkSubrouteConfig, ForkType, getRoute } from '../../../lib/route'
import { FourOhFour } from '../../views/shared/FourOhFour'
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
  const route = getRoute()
  if (!route) return null

  const rootFork = route.forks[ROUTE_CONFIG.forkName]
  switch (rootFork.type) {
    case ForkType.Default:
      return <div>INSERT LANDING PAGE HERE</div>
    case ForkType.Named:
      switch (rootFork.urlSegment) {
        case 'app':
          return (
            <SessionProvider>
              <AppRepProvider>
                <AppHandler />
              </AppRepProvider>
            </SessionProvider>
          )
        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${rootFork.urlSegment}' in root fork`}
            />
          )
      }
  }
  return <FourOhFour errorMessage={`unexpected fork type '${rootFork.type}' in root fork`} />
}
