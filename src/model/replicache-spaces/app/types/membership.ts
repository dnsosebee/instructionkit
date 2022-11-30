import { ReadTransaction } from 'replicache'
import { z } from 'zod'

export const MEMBERSHIP_ID_PREFIX = 'membership/'

export const membershipSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  accessPolicy: z.string(),
})

export type RepMembership = z.infer<typeof membershipSchema>

// get all memberships for the user with userId
export const listMemberships = async (tx: ReadTransaction): Promise<RepMembership[]> => {
  return (await tx.scan({ prefix: MEMBERSHIP_ID_PREFIX }).entries().toArray()).map(([k, v]) => {
    const [_, workspaceId, userId] = k.split('/')
    return {
      workspaceId,
      userId,
      accessPolicy: v,
    }
  }) as RepMembership[]
}

export const genMembershipDBKey = (workspaceId: string, userId: string) =>
  `${MEMBERSHIP_ID_PREFIX}${workspaceId}/${userId}`
