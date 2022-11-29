import { ReadTransaction } from 'replicache'
import { z } from 'zod'

export const INVITE_ID_PREFIX = 'invite/'

export const inviteSchema = z.object({
  workspaceId: z.string(),
  email: z.string(),
  accessPolicy: z.string(),
})

export type RepInvite = z.infer<typeof inviteSchema>

// get all memberships for the user with userId
export const listInvites = async (tx: ReadTransaction): Promise<RepInvite[]> => {
  return (await tx.scan({ prefix: INVITE_ID_PREFIX }).entries().toArray()).map(([k, v]) => {
    const [_, workspaceId, email] = k.split('/')
    return {
      workspaceId,
      email,
      accessPolicy: v,
    }
  }) as RepInvite[]
}

export type AcceptInvite = { invite: RepInvite; userId: string }
