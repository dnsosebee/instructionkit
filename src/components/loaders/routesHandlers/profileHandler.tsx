import { ForkSubrouteConfig, ForkType, getRoute } from '../../../lib/route'
import { FourOhFour } from '../../shared/FourOhFour'

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
  switch (profileFork) {
    case { type: ForkType.Default }:
      return <div>INSERT PROFILE HERE</div>
    case { type: ForkType.Named, urlSegment: 'reset-password' }:
      return <div>INSERT RESET PASSWORD HERE</div>
    default:
      return <FourOhFour />
  }
}
