import { ProjectView } from '../../../../pages/app/[workspaceId]/[projectId]'
import { ForkSubrouteConfig, ForkType, getRoute, ParamSubrouteConfig } from '../../../lib/route'
import { FourOhFour } from '../../views/shared/FourOhFour'
import FlowchartProvider from '../providers/flowchartProvider'
import { ProjectProvider } from '../providers/projectProvider'
import { useWorkspaceCtx } from '../providers/workspaceRepProvider'
import { WORKSPACE_ID_ROUTE_CONFIG } from './workspaceHandler'

const PROJECT_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'project',
  hasDefaultSubroute: true,
  namedSubroutes: {
    preview: {
      forkName: 'preview',
      hasDefaultSubroute: true,
    },
  },
}

export const PROJECT_ID_ROUTE_CONFIG: ParamSubrouteConfig = {
  paramName: 'projectId',
  subRoute: PROJECT_ROUTE_CONFIG,
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
      return (
        <FlowchartProvider>
          <ProjectView />
        </FlowchartProvider>
      )
    case ForkType.Named:
      switch (projectFork.urlSegment) {
        case 'preview':
          return <div className='text-white'>INSERT PREVIEW PAGE HERE</div>
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
