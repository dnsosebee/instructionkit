import { ReadTransaction } from 'replicache'
import { z } from 'zod'

// NOTE: Memberships are meant to be easily indexable in the database, so they are stored in a different format than most other entries. Maybe clean this up to use things from ids.ts?

export const MEMBERSHIP_KEY_PREFIX = 'member/'

export const membershipSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  accessPolicy: z.string(),
})

export type Membership = z.infer<typeof membershipSchema>

export const listMemberships = async (tx: ReadTransaction): Promise<Membership[]> => {
  return (await tx.scan({ prefix: MEMBERSHIP_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const [_, workspaceId, userId] = k.split('/')
    return {
      workspaceId,
      userId,
      accessPolicy: v,
    }
  }) as Membership[]
}

export const membershipKey = (workspaceId: string, userId: string) =>
  `${MEMBERSHIP_KEY_PREFIX}${workspaceId}/${userId}`
