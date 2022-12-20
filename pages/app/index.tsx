import { RootHandler } from '../../src/components/route/handlers/rootHandler'
import { setRoute } from '../../src/routeComponents/route'

const AppPage = () => {
  setRoute({ route: `/app`, replace: false })
  return <RootHandler />
}

export default AppPage
