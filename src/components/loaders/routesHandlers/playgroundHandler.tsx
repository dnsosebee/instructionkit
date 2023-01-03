import { PlaygroundView } from '../../../../pages/playground/[floem]'
import { PlaygroundPreviewView } from '../../../../pages/playground/[floem]/preview'
import {
  ForkSubrouteConfig,
  ForkType,
  getRoute,
  ParamSubrouteConfig,
  setRoute,
} from '../../../lib/route'
import { genDefaultFloem, urlEncodeFloem } from '../../../model/url/floem'
import { FourOhFour } from '../../views/shared/FourOhFour'

const FLOEM_FORK_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'floem',
  hasDefaultSubroute: true,
  namedSubroutes: {
    preview: {
      forkName: 'preview',
      hasDefaultSubroute: true,
    },
  },
}

const FLOEM_PARAM_ROUTE_CONFIG: ParamSubrouteConfig = {
  paramName: 'floem',
  subroute: FLOEM_FORK_ROUTE_CONFIG,
}

export const PLAYGROUND_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'playground',
  hasDefaultSubroute: true,
  dynamicSubroute: FLOEM_PARAM_ROUTE_CONFIG,
}

export const PlaygroundHandler = () => {
  const playgroundFork = getRoute().forks[PLAYGROUND_ROUTE_CONFIG.forkName]
  switch (playgroundFork.type) {
    case ForkType.Default:
      setRoute({ route: `/playground/${urlEncodeFloem(genDefaultFloem())}`, action: 'none' })
      return null
    case ForkType.Dynamic:
      return <FloemDataHandler />
  }
  return (
    <FourOhFour errorMessage={`unexpected fork type '${playgroundFork.type}' in playground fork`} />
  )
}

const FloemDataHandler = () => {
  const floemFork = getRoute().forks[FLOEM_FORK_ROUTE_CONFIG.forkName]
  switch (floemFork.type) {
    case ForkType.Default:
      return <PlaygroundView />
    case ForkType.Named:
      switch (floemFork.urlSegment) {
        case 'preview':
          return <PlaygroundPreviewView />
        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${floemFork.urlSegment}' in floem fork`}
            />
          )
      }
  }
  return <FourOhFour errorMessage={`unexpected fork type '${floemFork.type}' in floem fork`} />
}
