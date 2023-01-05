import { ReadTransaction } from 'replicache'
import { Invite } from '../../../../../schema/types/invite'
import { scopedKey, scopedUnkey } from '../../../key'

// NOTE: Invites are meant to be easily indexable in the database, so they are stored in a different format than most other entries. Maybe clean this up to use things from ids.ts?

const INVITE_KEY_PREFIX = 'inv/'
export const inviteKey = scopedKey(INVITE_KEY_PREFIX)
const inviteUnkey = scopedUnkey(INVITE_KEY_PREFIX)

export const listInvites = async (tx: ReadTransaction): Promise<Invite[]> => {
  return (await tx.scan({ prefix: INVITE_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const { parent: workspaceId, child: email } = inviteUnkey(k)
    return {
      workspaceId,
      email,
      accessPolicy: v as string,
    }
  }) as Invite[]
}

export const listWorkspaceInviteKeys = async (
  tx: ReadTransaction,
  workspaceId: string,
): Promise<string[]> => {
  return await tx
    .scan({ prefix: `${INVITE_KEY_PREFIX}${workspaceId}/` })
    .keys()
    .toArray()
}

export type AcceptInvite = { invite: Invite; userId: string }
