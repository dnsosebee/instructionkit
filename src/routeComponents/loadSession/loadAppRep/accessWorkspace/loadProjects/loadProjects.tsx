import { RepProject } from '../../../../../model/replicache/spaces/ws-[id]/entries/proj'
import { ActionSubroute } from '../../../../route'

export type LoadProjectsSubroute = ActionSubroute<{
  name: 'loadProjects'
  requiresInput: false
}>

export type LoadProjectsContext = {
  projects: RepProject[]
}

export const LoadProjects = ({ route }: { route: LoadProjectsSubroute }) => {
  return <>Let's load projects!</>
}
