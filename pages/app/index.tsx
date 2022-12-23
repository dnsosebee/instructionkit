import { RootHandler } from '../../src/components/loaders/routesHandlers/rootHandler'
import { setRoute } from '../../src/lib/route'

const AppPage = () => {
  setRoute({ route: `/app`, action: 'none' })
  return <RootHandler />
}

export default AppPage
