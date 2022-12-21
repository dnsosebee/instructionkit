import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import { setRoute } from '../../../src/lib/route'

const ProfilePage = () => {
  setRoute({ route: `/app/profile`, replace: false })
  return <RootHandler />
}

export default ProfilePage
