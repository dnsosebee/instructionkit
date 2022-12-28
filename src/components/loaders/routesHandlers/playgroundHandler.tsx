import { PlaygroundView } from '../../../../pages/playground.tsx/[data]'
import { PlaygroundPreviewView } from '../../../../pages/playground.tsx/[data]/preview'
import {
  ForkSubrouteConfig,
  ForkType,
  getRoute,
  ParamSubrouteConfig,
  setRoute,
} from '../../../lib/route'
import { genFlowId } from '../../../model/replicache/spaces/proj/entries/flow/flow'
import { genVersionId } from '../../../model/replicache/spaces/proj/entries/version'
import { Playground, urlEncodePlayground } from '../../../model/url/playground'
import { FourOhFour } from '../../views/shared/FourOhFour'

const genPlayground = (): Playground => ({
  id: genVersionId(),
  flows: [
    {
      id: genFlowId(),
      type: 'start',
      flowtext: '<h1>Hello world!</h1>',
      position: { x: 0, y: 0 },
    },
  ],
  darts: [],
  createdAt: Date.now(),
  title: 'Blank project',
  schemaVersion: 1,
})
const PLAYGROUND_DATA_FORK_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'playgroundData',
  hasDefaultSubroute: true,
  namedSubroutes: {
    preview: {
      forkName: 'preview',
      hasDefaultSubroute: true,
    },
  },
}

const PLAYGROUND_DATA_ROUTE_CONFIG: ParamSubrouteConfig = {
  paramName: 'playgroundData',
  subroute: PLAYGROUND_DATA_FORK_ROUTE_CONFIG,
}

export const PLAYGROUND_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'playground',
  hasDefaultSubroute: true,
  dynamicSubroute: PLAYGROUND_DATA_ROUTE_CONFIG,
}

export const PlaygroundHandler = () => {
  const playgroundFork = getRoute().forks[PLAYGROUND_ROUTE_CONFIG.forkName]
  switch (playgroundFork.type) {
    case ForkType.Default:
      setRoute({ route: `/playground/${urlEncodePlayground(genPlayground())}`, action: 'none' })
      return null
    case ForkType.Dynamic:
      return <PlaygroundDataHandler />
  }
  return (
    <FourOhFour errorMessage={`unexpected fork type '${playgroundFork.type}' in playground fork`} />
  )
}

const PlaygroundDataHandler = () => {
  const playgroundDataFork = getRoute().forks[PLAYGROUND_DATA_ROUTE_CONFIG.subroute.forkName]
  switch (playgroundDataFork.type) {
    case ForkType.Default:
      return <PlaygroundView />
    case ForkType.Named:
      switch (playgroundDataFork.urlSegment) {
        case 'preview':
          return <PlaygroundPreviewView />
        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${playgroundDataFork.urlSegment}' in playgroundData fork`}
            />
          )
      }
  }
  return (
    <FourOhFour
      errorMessage={`unexpected fork type '${playgroundDataFork.type}' in playgroundData fork`}
    />
  )
}
