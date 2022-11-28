import { Replicache, WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../logger'
import { membershipSchema, MEMBERSHIP_ID_PREFIX, RepMembership } from './membership'

const logger = parentLogger.child({ module: 'model/memberships/mutators' })

export type MembershipMutators = typeof membershipMutators
export type MembershipRep = Replicache<MembershipMutators>
export type MembershipMutate = MembershipRep['mutate']

export const membershipMutators = {
  async createOrUpdateMembership(tx: WriteTransaction, membership: RepMembership) {
    logger.info('createOrUpdateMembership', membership)
    membershipSchema.parse(membership)
    await tx.put(
      `${MEMBERSHIP_ID_PREFIX}${membership.workspaceId}/${membership.userId}`,
      membership.accessPolicy,
    )
  },
  async deleteMembership(tx: WriteTransaction, membership: RepMembership) {
    logger.info('deleteMembership', membership)
    await tx.del(`${MEMBERSHIP_ID_PREFIX}${membership.workspaceId}/${membership.userId}`)
  },
}
