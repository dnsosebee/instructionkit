import { ReadTransaction } from 'replicache'
import { Membership } from '../../../../../schema/types/membership'
import { scopedKey, scopedUnkey } from '../../../key'

// NOTE: Memberships are meant to be easily indexable in the database, so they are stored in a different format than most other entries. Maybe clean this up to use things from ids.ts?

const MEMBERSHIP_KEY_PREFIX = 'member/'
export const membershipKey = scopedKey(MEMBERSHIP_KEY_PREFIX)
const membershipUnkey = scopedUnkey(MEMBERSHIP_KEY_PREFIX)

export const listMemberships = async (tx: ReadTransaction): Promise<Membership[]> => {
  return (await tx.scan({ prefix: MEMBERSHIP_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const { parent: workspaceId, child: userId } = membershipUnkey(k)
    return {
      workspaceId,
      userId,
      accessPolicy: v,
    }
  }) as Membership[]
}

export const listWorkspaceMembershipKeys = async (
  tx: ReadTransaction,
  workspaceId: string,
): Promise<string[]> => {
  return await tx
    .scan({ prefix: `${MEMBERSHIP_KEY_PREFIX}${workspaceId}/` })
    .keys()
    .toArray()
}
