import { RootHandler } from '../../src/components/loaders/routeHandlers/rootHandler'
import { setRoute } from '../../src/lib/route/route'

const PlaygroundPage = () => {
  setRoute({ route: '/playground', action: 'none' })
  return <RootHandler />
}

export default PlaygroundPage
