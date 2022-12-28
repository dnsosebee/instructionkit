import { RootHandler } from '../../src/components/loaders/routesHandlers/rootHandler'
import { setRoute } from '../../src/lib/route'

const PlaygroundPage = () => {
  setRoute({ route: `/playground`, action: 'none' })
  return <RootHandler />
}

export default PlaygroundPage
