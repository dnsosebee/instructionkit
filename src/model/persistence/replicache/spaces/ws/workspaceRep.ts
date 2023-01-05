import { Replicache } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { z } from 'zod'
import { WORKSPACE_ID_LENGTH } from '../../../../schema/types/workspace'
import { workspaceKey, WORKSPACE_KEY_PREFIX } from '../app/entries/ws'
import { workspaceMutators, WorkspaceMutators } from './workspaceMutators'

export const WORKSPACE_SPACE_ID_PREFIX = WORKSPACE_KEY_PREFIX

export const workspaceSpaceId = workspaceKey
export const workspaceSpaceIdSchema = z
  .string()
  .startsWith(WORKSPACE_SPACE_ID_PREFIX)
  .length(WORKSPACE_ID_LENGTH + WORKSPACE_SPACE_ID_PREFIX.length)

export type WorkspaceRep = Replicache<WorkspaceMutators>

export const useWorkspaceRep = (workspaceId: string) => {
  return useReplicache({
    name: workspaceSpaceId(workspaceId),
    mutators: workspaceMutators,
  })
}
