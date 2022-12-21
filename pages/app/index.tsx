import { RootHandler } from '../../src/components/loaders/routesHandlers/rootHandler'
import { setRoute } from '../../src/lib/route'

const AppPage = () => {
  setRoute({ route: `/app`, replace: false })
  return <RootHandler />
}

export default AppPage
