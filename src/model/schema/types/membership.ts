import { z } from 'zod'

export const membershipSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  accessPolicy: z.string(),
})

export type Membership = z.infer<typeof membershipSchema>
