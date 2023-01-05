import { ProjectView } from '../../../../pages/[workspaceId]/[projectId]'
import { PreviewView } from '../../../../pages/[workspaceId]/[projectId]/preview'
import {
  ForkSubrouteConfig,
  ForkType,
  getRoute,
  ParamSubrouteConfig,
} from '../../../lib/route/route'
import { FourOhFour } from '../../views/shared/FourOhFour'
import { ProjectProvider } from '../providers/projectProvider'
import { useWorkspaceCtx } from '../providers/workspaceProvider'
import { InitHandler, INTERNAL_INIT_ROUTE_CONFIG } from './initHandler'
import { WORKSPACE_ID_ROUTE_CONFIG } from './workspaceHandler'

export const PROJECT_HREF = (workspaceId: string, projectId: string) =>
  `/${workspaceId}/${projectId}`

export const PROJECT_PREVIEW_HREF = (workspaceId: string, projectId: string) =>
  `${PROJECT_HREF(workspaceId, projectId)}/preview`

const PROJECT_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'project',
  hasDefaultSubroute: true,
  namedSubroutes: {
    preview: {
      forkName: 'preview',
      hasDefaultSubroute: true,
    },
    init: INTERNAL_INIT_ROUTE_CONFIG,
  },
}

export const PROJECT_ID_ROUTE_CONFIG: ParamSubrouteConfig = {
  paramName: 'projectId',
  subroute: PROJECT_ROUTE_CONFIG,
}

export const ProjectIdHandler = () => {
  const params = getRoute().params
  const { projects } = useWorkspaceCtx()
  const workspaceId = params[WORKSPACE_ID_ROUTE_CONFIG.paramName]
  const projectId = params[PROJECT_ID_ROUTE_CONFIG.paramName]
  if (!projects.find(v => v.id === projectId)) {
    return (
      <FourOhFour
        errorMessage={`workspace with id '${workspaceId}' does not have a project with id '${projectId}'`}
      />
    )
  }

  return (
    <ProjectProvider
      workspaceId={params[WORKSPACE_ID_ROUTE_CONFIG.paramName]}
      projectId={params[PROJECT_ID_ROUTE_CONFIG.paramName]}
    >
      <ProjectHandler />
    </ProjectProvider>
  )
}

const ProjectHandler = () => {
  const projectFork = getRoute().forks[PROJECT_ROUTE_CONFIG.forkName]
  switch (projectFork.type) {
    case ForkType.Default:
      return <ProjectView />
    case ForkType.Named:
      switch (projectFork.urlSegment) {
        case 'preview':
          return <PreviewView />
        case 'init':
          return <InitHandler />
        default:
          return (
            <FourOhFour
              errorMessage={`unexpected urlSegment '${projectFork.urlSegment}' in project fork`}
            />
          )
      }
    default:
      return (
        <FourOhFour errorMessage={`unexpected fork type '${projectFork.type}' in project fork`} />
      )
  }
}
