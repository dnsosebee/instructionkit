import { logger } from '@supabase/auth-helpers-nextjs'
import { ForkSubrouteConfig, ForkType, getRoute, setRoute } from '../../../lib/route'
import { FourOhFour } from '../../views/shared/FourOhFour'
import { useAppRepCtx } from '../providers/appRepProvider'
import { ProfileHandler, PROFILE_ROUTE_CONFIG } from './profileHandler'
import { WorkspaceIdHandler, WORKSPACE_ID_ROUTE_CONFIG } from './workspaceHandler'

export const APP_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'app',
  hasDefaultSubroute: true,
  namedSubroutes: {
    profile: PROFILE_ROUTE_CONFIG,
    test: {
      forkName: 'test',
      hasDefaultSubroute: true,
    },
  },
  dynamicSubroute: WORKSPACE_ID_ROUTE_CONFIG,
}

export const AppHandler = () => {
  const { defaultWorkspaceId, createWorkspace } = useAppRepCtx()
  const appFork = getRoute().forks[APP_ROUTE_CONFIG.forkName]
  logger.debug('appFork', appFork)
  switch (appFork.type) {
    case ForkType.Default:
      setRoute({ route: `/app/${defaultWorkspaceId}`, replace: true })
      return null
    case ForkType.Named:
      switch (appFork.urlSegment) {
        case 'profile':
          return <ProfileHandler />
        case 'test':
          return (
            <div className='bg-white'>
              <h1>Test</h1>
              <button onClick={e => createWorkspace()}>Create Workspace</button>
            </div>
          )
        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${appFork.urlSegment}' in app fork`}
            />
          )
      }
    case ForkType.Dynamic:
      return <WorkspaceIdHandler />
  }
}
