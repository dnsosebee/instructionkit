import { PlaygroundView } from '../../../../pages/playground/[floem]'
import { PlaygroundPreviewView } from '../../../../pages/playground/[floem]/preview'
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
import { Floem, urlEncodeFloem } from '../../../model/url/floem'
import { FourOhFour } from '../../views/shared/FourOhFour'

const genFloem = (): Floem => {
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
        position: { x: 50, y: 150 },
        flowtext: '<h1>My Beautiful New Guide</h1><p>Let’s get started!</p>',
      },
    ],
    darts: [
      {
        id: genDartId(),
        type: GOTO_DART_TYPE,
        from: startId,
        case: DEFAULT_HANDLE_ID,
        to: branchId,
      },
    ],
    createdAt: Date.now(),
    title: 'Blank project',
    schemaVersion: 1,
  }
}
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
      setRoute({ route: `/playground/${urlEncodeFloem(genFloem())}`, action: 'none' })
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
