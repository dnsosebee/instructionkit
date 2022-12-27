import { ForkSubrouteConfig, ForkType, getRoute, setRoute } from '../../../lib/route'
import { FourOhFour } from '../../views/shared/FourOhFour'

export const PLAYGROUND_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'playground',
  hasDefaultSubroute: true,
  dynamicSubroute: {
    paramName: 'playgroundData',
    subroute: {
      forkName: 'playgroundData',
      hasDefaultSubroute: true,
    },
  },
}

export const PlaygroundHandler = () => {
  const playgroundFork = getRoute().forks[PLAYGROUND_ROUTE_CONFIG.forkName]
  switch (playgroundFork.type) {
    case ForkType.Default:
      setRoute({ route: `/playground/${DEFAULT_PLAYGROUND_DATA}`, action: 'replace' })
  }
  return <FourOhFour errorMessage={`unexpected fork type '${rootFork.type}' in root fork`} />
}
