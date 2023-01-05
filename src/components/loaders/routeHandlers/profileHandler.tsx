import { ProfileView } from '../../../../pages/profile'
import { UpdatePasswordView } from '../../../../pages/profile/updatepassword'
import { ForkSubrouteConfig, ForkType, getRoute } from '../../../lib/route/route'
import { FourOhFour } from '../../views/shared/FourOhFour'

export const PROFILE_HREF = `/profile`
export const UPDATE_PASSWORD_HREF = `/profile/updatepassword`

export const PROFILE_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'profile',
  hasDefaultSubroute: true,
  namedSubroutes: {
    updatepassword: {
      forkName: 'updatepassword',
      hasDefaultSubroute: true,
    },
  },
}

export const ProfileHandler = () => {
  const profileFork = getRoute().forks[PROFILE_ROUTE_CONFIG.forkName]
  switch (profileFork.type) {
    case ForkType.Default:
      return <ProfileView />
    case ForkType.Named:
      switch (profileFork.urlSegment) {
        case 'updatepassword':
          return <UpdatePasswordView />
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
