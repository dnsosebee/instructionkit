import { useEffect } from 'react'
import { ForkSubrouteConfig, ForkType, getRoute, setRoute } from '../../../lib/route/route'
import { FourOhFour } from '../../views/shared/FourOhFour'
import { AppProvider, useAppCtx } from '../providers/appProvider'
import { SessionProvider } from '../providers/sessionProvider/sessionProvider'
import { PlaygroundHandler, PLAYGROUND_ROUTE_CONFIG } from './playgroundHandler'
import { ProfileHandler, PROFILE_ROUTE_CONFIG } from './profileHandler'
import { WorkspaceIdHandler, WORKSPACE_ID_ROUTE_CONFIG } from './workspaceHandler'

export const ROOT_HREF = '/'

export const ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'root',
  hasDefaultSubroute: true,
  namedSubroutes: {
    profile: PROFILE_ROUTE_CONFIG,
    playground: PLAYGROUND_ROUTE_CONFIG,
  },
  dynamicSubroute: WORKSPACE_ID_ROUTE_CONFIG,
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
  if (rootFork.type === ForkType.Named && rootFork.urlSegment === 'playground') {
    return <PlaygroundHandler />
  }
  return (
    <SessionProvider>
      <AppProvider>
        <AppHandler />
      </AppProvider>
    </SessionProvider>
  )
}

const AppHandler = () => {
  const { defaultWorkspaceId } = useAppCtx()
  const rootFork = getRoute().forks[ROUTE_CONFIG.forkName]
  switch (rootFork.type) {
    case ForkType.Default:
      setRoute({ route: `/${defaultWorkspaceId}`, action: 'replace' })
      return null
    case ForkType.Named:
      switch (rootFork.urlSegment) {
        case 'profile':
          return <ProfileHandler />

        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${rootFork.urlSegment}' in root fork`}
            />
          )
      }
    case ForkType.Dynamic:
      return <WorkspaceIdHandler />
  }
}
