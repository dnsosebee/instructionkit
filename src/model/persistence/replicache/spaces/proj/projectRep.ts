import { Replicache } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { z } from 'zod'
import { PROJECT_ID_LENGTH } from '../../../../schema/types/project'
import { WORKSPACE_ID_LENGTH } from '../../../../schema/types/workspace'
import { scopedKey } from '../../key'
import { PROJECT_KEY_PREFIX } from '../ws/entries/proj'
import { projectMutators, ProjectMutators } from './projectMutators'

export const PROJECT_SPACE_ID_PREFIX = PROJECT_KEY_PREFIX

// for creating and accessing a project's replicache instance, we want to scope by workspaceId and projectId (for better Supabase RLS efficiency)
// note that this is different from the projectKey within the workspaceRep, which is not scoped by workspaceId
export const projectSpaceId = scopedKey(PROJECT_SPACE_ID_PREFIX)
export const projectSpaceIdSchema = z
  .string()
  .startsWith(PROJECT_SPACE_ID_PREFIX)
  .length(PROJECT_SPACE_ID_PREFIX.length + WORKSPACE_ID_LENGTH + '/'.length + PROJECT_ID_LENGTH)

export type ProjectRep = Replicache<ProjectMutators>

export const useProjectRep = (workspaceId: string, projectId: string) => {
  return useReplicache({
    name: projectSpaceId(workspaceId, projectId),
    mutators: projectMutators,
  })
}
