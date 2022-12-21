import { ForkSubrouteConfig, ForkType, getRoute } from '../../../lib/route'
import { FourOhFour } from '../../views/shared/FourOhFour'

export const PROFILE_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'profile',
  hasDefaultSubroute: true,
  namedSubroutes: {
    'reset-password': {
      forkName: 'reset-password',
      hasDefaultSubroute: true,
    },
  },
}

export const ProfileHandler = () => {
  const profileFork = getRoute().forks[PROFILE_ROUTE_CONFIG.forkName]
  switch (profileFork.type) {
    case ForkType.Default:
      return <div>INSERT PROFILE HERE</div>
    case ForkType.Named:
      switch (profileFork.urlSegment) {
        case 'reset-password':
          return <div>INSERT RESET PASSWORD HERE</div>
        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${profileFork.urlSegment}' in profile fork`}
            />
          )
      }
    default:
      return (
        <FourOhFour errorMessage={`unexpected fork type '${profileFork.type}' in profile fork`} />
      )
  }
}
