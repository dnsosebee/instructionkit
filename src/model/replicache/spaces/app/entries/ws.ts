import { ReadTransaction } from 'replicache'
import z from 'zod'
import { genId, id, key } from '../../../IdsAndKeys'

export const WORKSPACE_KEY_PREFIX = 'ws/'
export const WORKSPACE_ID_LENGTH = 8
const workspaceValueSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().min(1).max(100), // TODO: tighten this up
  createdAt: z.number().int().positive(),
})
export const workspaceSchema = workspaceValueSchema.extend({
  id: z.string().length(WORKSPACE_ID_LENGTH),
})
export const genWorkspaceId = genId(WORKSPACE_ID_LENGTH)
export const workspaceKey = key(WORKSPACE_KEY_PREFIX)
const workspaceId = id(WORKSPACE_KEY_PREFIX)

export type RepWorkspace = z.infer<typeof workspaceSchema>
export type WorkspaceUpdate = { id: string } & Partial<Omit<RepWorkspace, 'createdAt'>>

export const listWorkspaces = async (tx: ReadTransaction): Promise<RepWorkspace[]> => {
  return (await tx.scan({ prefix: WORKSPACE_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    return {
      ...workspaceValueSchema.parse(v),
      id: workspaceId(k),
    }
  })
}
