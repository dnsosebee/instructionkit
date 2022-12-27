import { useEffect } from 'react'
import { ForkSubrouteConfig, ForkType, getRoute, setRoute } from '../../../lib/route'
import { FourOhFour } from '../../views/shared/FourOhFour'
import { AppProvider } from '../providers/appProvider'
import { SessionProvider } from '../providers/sessionProvider/sessionProvider'
import { AppHandler, APP_ROUTE_CONFIG } from './appHandler'

export const ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'root',
  namedSubroutes: {
    app: APP_ROUTE_CONFIG,
    playground: PLAYGROUND_ROUTE_CONFIG,
  },
}

export const RootHandler = () => {
  const route = getRoute()
  if (!route) return null

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setRoute({ route: window.location.pathname, action: 'none' })
    })
  })

  const rootFork = route.forks[ROUTE_CONFIG.forkName]
  switch (rootFork.type) {
    case ForkType.Named:
      switch (rootFork.urlSegment) {
        case 'app':
          return (
            <SessionProvider>
              <AppProvider>
                <AppHandler />
              </AppProvider>
            </SessionProvider>
          )
        case 'playground':
          return <PlaygroundHandler />
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
