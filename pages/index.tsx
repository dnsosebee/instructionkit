import { RootHandler, ROOT_HREF } from '../src/components/loaders/routeHandlers/rootHandler'
import { setRoute } from '../src/lib/route/route'

const AppPage = () => {
  setRoute({ route: ROOT_HREF, action: 'none' })
  return <RootHandler />
}

export default AppPage
