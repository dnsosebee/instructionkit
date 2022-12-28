import { ReadTransaction } from 'replicache'
import { z } from 'zod'

// NOTE: Invites are meant to be easily indexable in the database, so they are stored in a different format than most other entries. Maybe clean this up to use things from ids.ts?

export const INVITE_KEY_PREFIX = 'inv/'

export const inviteSchema = z.object({
  workspaceId: z.string(),
  email: z.string(),
  accessPolicy: z.string(),
})

export type Invite = z.infer<typeof inviteSchema>

// get all memberships for the user with userId
export const listInvites = async (tx: ReadTransaction): Promise<Invite[]> => {
  return (await tx.scan({ prefix: INVITE_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const [_, workspaceId, email] = k.split('/')
    return {
      workspaceId,
      email,
      accessPolicy: v,
    }
  }) as Invite[]
}

export type AcceptInvite = { invite: Invite; userId: string }

export const inviteKey = (workspaceId: string, email: string) =>
  `${INVITE_KEY_PREFIX}${workspaceId}/${email}`
