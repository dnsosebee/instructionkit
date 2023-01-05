import { z } from 'zod'
import { genId } from '../id'

export const WORKSPACE_ID_LENGTH = 8
export const genWorkspaceId = genId(WORKSPACE_ID_LENGTH)

export const workspaceSchema = z.object({
  id: z.string().length(WORKSPACE_ID_LENGTH),
  name: z.string().min(1).max(100),
  icon: z.string().min(1).max(100), // TODO: tighten this up
  createdAt: z.number().int().positive(),
})

export type Workspace = z.infer<typeof workspaceSchema>
