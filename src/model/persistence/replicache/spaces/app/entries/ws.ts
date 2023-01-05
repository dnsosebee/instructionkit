import { ReadTransaction } from 'replicache'
import { Workspace, workspaceSchema } from '../../../../../schema/types/workspace'
import { key, unkey } from '../../../key'

export const WORKSPACE_KEY_PREFIX = 'ws/'

export const workspaceKey = key(WORKSPACE_KEY_PREFIX)
const workspaceUnkey = unkey(WORKSPACE_KEY_PREFIX)

export type WorkspaceUpdate = { id: string } & Partial<Omit<Workspace, 'createdAt'>>

export const listWorkspaces = async (tx: ReadTransaction): Promise<Workspace[]> => {
  return (await tx.scan({ prefix: WORKSPACE_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    return {
      ...workspaceSchema.parse(v),
      id: workspaceUnkey(k),
    }
  })
}
