import { z } from 'zod'

export const inviteSchema = z.object({
  workspaceId: z.string(),
  email: z.string(),
  accessPolicy: z.string(),
})

export type Invite = z.infer<typeof inviteSchema>
