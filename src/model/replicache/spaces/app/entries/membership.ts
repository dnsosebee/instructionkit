import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { SUPABASE_USER_ID_LENGTH } from '../../../../supabase'
import { WORKSPACE_UUID_LENGTH } from './ws'

// NOTE: Memberships are meant to be easily indexable in the database, so they are stored in a different format than most other entries.

export const MEMBERSHIP_KEY_PREFIX = 'member'

export const membershipSchema_client = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  accessPolicy: z.string(),
})

export type RepMembership = z.infer<typeof membershipSchema_client>

export const membershipSchema_dbKey = z
  .string()
  .startsWith(MEMBERSHIP_KEY_PREFIX + '/')
  .length(
    MEMBERSHIP_KEY_PREFIX.length +
      '/'.length +
      WORKSPACE_UUID_LENGTH +
      '/'.length +
      SUPABASE_USER_ID_LENGTH,
  )

export const listMemberships = async (tx: ReadTransaction): Promise<RepMembership[]> => {
  return (await tx.scan({ prefix: MEMBERSHIP_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const [_, workspaceId, userId] = k.split('/')
    return {
      workspaceId,
      userId,
      accessPolicy: v,
    }
  }) as RepMembership[]
}

export const getMembershipDBKey = (workspaceId: string, userId: string) =>
  `${MEMBERSHIP_KEY_PREFIX}/${workspaceId}/${userId}`
