import { PlaygroundView } from '../../../../pages/playground/[playgroundData]'
import { PlaygroundPreviewView } from '../../../../pages/playground/[playgroundData]/preview'
import {
  ForkSubrouteConfig,
  ForkType,
  getRoute,
  ParamSubrouteConfig,
  setRoute,
} from '../../../lib/route'
import { genDartId } from '../../../model/replicache/spaces/proj/entries/dart/dart'
import { GOTO_DART_TYPE } from '../../../model/replicache/spaces/proj/entries/dart/types/goto'
import { genFlowId } from '../../../model/replicache/spaces/proj/entries/flow/flow'
import { BRANCH_FLOW_TYPE } from '../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { START_FLOW_TYPE } from '../../../model/replicache/spaces/proj/entries/flow/types/start'
import { genVersionId } from '../../../model/replicache/spaces/proj/entries/version'
import { DEFAULT_HANDLE_ID } from '../../../model/tiptap/flowtextExtension'
import { Playground, urlEncodePlayground } from '../../../model/url/playground'
import { FourOhFour } from '../../views/shared/FourOhFour'

const genPlayground = (): Playground => {
  const startId = genFlowId()
  const branchId = genFlowId()
  return {
    id: genVersionId(),
    flows: [
      {
        id: startId,
        type: START_FLOW_TYPE,
        position: { x: 0, y: 0 },
      },
      {
        id: branchId,
        type: BRANCH_FLOW_TYPE,
        position: { x: 0, y: 200 },
        flowtext: '<h1>My Beautiful New Guide</h1>',
      },
    ],
    darts: [
      {
        id: genDartId(),
        type: GOTO_DART_TYPE,
        from: startId,
        fromHandle: DEFAULT_HANDLE_ID,
        to: branchId,
      },
    ],
    createdAt: Date.now(),
    title: 'Blank project',
    schemaVersion: 1,
  }
}
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
