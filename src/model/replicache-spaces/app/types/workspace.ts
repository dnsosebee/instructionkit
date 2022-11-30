import { ReadTransaction } from 'replicache'
import z from 'zod'

export const WORKSPACE_ID_PREFIX = 'ws-'

export const workspaceSchema = z.object({
  id: z.string().startsWith(WORKSPACE_ID_PREFIX),
  name: z.string(),
  icon: z.string(),
  createdAt: z.number(),
})

export type RepWorkspace = z.infer<typeof workspaceSchema>
export type WorkspaceUpdate = Pick<RepWorkspace, 'id'> &
  Partial<Pick<RepWorkspace, 'name' | 'icon'>>

export const listWorkspaces = async (tx: ReadTransaction): Promise<RepWorkspace[]> => {
  return (await tx.scan({ prefix: WORKSPACE_ID_PREFIX }).values().toArray()) as RepWorkspace[]
}
