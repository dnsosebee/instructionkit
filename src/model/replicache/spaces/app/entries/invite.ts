import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { SUPABASE_USER_ID_LENGTH } from '../../../../supabase'
import { WORKSPACE_UUID_LENGTH } from './ws'

// NOTE: Invites are meant to be easily indexable in the database, so they are stored in a different format than most other entries.

export const INVITE_KEY_PREFIX = 'inv'

export const inviteSchema_client = z.object({
  workspaceId: z.string(),
  email: z.string(),
  accessPolicy: z.string(),
})

export type RepInvite = z.infer<typeof inviteSchema_client>

export const inviteSchema_dbKey = z
  .string()
  .startsWith(INVITE_KEY_PREFIX + '/')
  .length(
    INVITE_KEY_PREFIX.length +
      '/'.length +
      WORKSPACE_UUID_LENGTH +
      '/'.length +
      SUPABASE_USER_ID_LENGTH,
  )

// get all memberships for the user with userId
export const listInvites = async (tx: ReadTransaction): Promise<RepInvite[]> => {
  return (await tx.scan({ prefix: INVITE_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const [_, workspaceId, email] = k.split('/')
    return {
      workspaceId,
      email,
      accessPolicy: v,
    }
  }) as RepInvite[]
}

export type AcceptInvite = { invite: RepInvite; userId: string }

export const inviteKey = (workspaceId: string, email: string) =>
  `${INVITE_KEY_PREFIX}/${workspaceId}/${email}`
