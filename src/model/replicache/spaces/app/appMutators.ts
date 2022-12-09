import { Replicache, WriteTransaction } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { logger as parentLogger } from '../../../../logger'
import {
  AcceptInvite,
  inviteKey,
  inviteSchema_client,
  INVITE_KEY_PREFIX,
  RepInvite,
} from './entries/invite'
import {
  getMembershipDBKey as membershipKey,
  membershipSchema_client,
  MEMBERSHIP_KEY_PREFIX,
  RepMembership,
} from './entries/membership'
import { RepWorkspace, workspaceSchema, WorkspaceUpdate } from './entries/ws'
const logger = parentLogger.child({ module: 'appMutators' })

export const APP_SPACE_ID = 'app'
export type AppMutators = typeof appMutators
export type AppRep = Replicache<AppMutators>
export type AppMutate = AppRep['mutate']

const appMutators = {
  // invites
  async createOrUpdateInvite(tx: WriteTransaction, invite: RepInvite) {
    logger.info('createOrUpdateInvite', invite)
    inviteSchema_client.parse(invite)
    await tx.put(inviteKey(invite.workspaceId, invite.email), invite.accessPolicy)
  },
  async deleteInvite(tx: WriteTransaction, invite: RepInvite) {
    logger.info('deleteInvite', invite)
    inviteSchema_client.parse(invite)
    await tx.del(inviteKey(invite.workspaceId, invite.email))
  },

  // invites and memberships
  async acceptInvite(tx: WriteTransaction, acceptInvite: AcceptInvite) {
    logger.info('acceptInvite', acceptInvite)
    const { invite, userId } = acceptInvite
    inviteSchema_client.parse(invite)
    await Promise.all([
      tx.del(inviteKey(invite.workspaceId, invite.email)),
      tx.put(membershipKey(invite.workspaceId, userId), invite.accessPolicy),
    ])
  },

  // memberships
  async deleteMembership(tx: WriteTransaction, membership: RepMembership) {
    logger.info('deleteMembership', membership)
    membershipSchema_client.parse(membership)
    await tx.del(membershipKey(membership.workspaceId, membership.userId))
  },

  // memberships and workspaces
  async createWorkspaceWithOwner(
    tx: WriteTransaction,
    data: { workspace: RepWorkspace; userId: string },
  ) {
    logger.info('createWorkspaceWithOwner', data)
    const { workspace, userId } = data
    const membership = {
      workspaceId: workspace.id,
      userId,
      accessPolicy: 'owner',
    }
    workspaceSchema.parse(workspace)
    membershipSchema_client.parse(membership)
    // ensure workspace doesn't already exist
    const existingWorkspace = await tx.get(workspace.id)
    if (existingWorkspace) {
      throw new Error(`Workspace ${workspace.id} already exists`)
    }
    await Promise.all([
      tx.put(workspace.id, workspace),
      tx.put(membershipKey(workspace.id, userId), membership.accessPolicy),
    ])
  },

  async deleteWorkspace(tx: WriteTransaction, workspaceId: string) {
    logger.info('deleteWorkspace', workspaceId)
    const invites = await tx
      .scan({ prefix: `${INVITE_KEY_PREFIX}${workspaceId}` })
      .keys()
      .toArray()
    const memberships = await tx
      .scan({ prefix: `${MEMBERSHIP_KEY_PREFIX}${workspaceId}` })
      .keys()
      .toArray()
    await Promise.all([
      tx.del(workspaceId),
      ...invites.map(invite => tx.del(invite)),
      ...memberships.map(membership => tx.del(membership)),
    ])
  },

  async updateWorkspace(tx: WriteTransaction, workspaceUpdate: WorkspaceUpdate) {
    logger.info('updateWorkspace', workspaceUpdate)
    const workspace = (await tx.get(workspaceUpdate.id)) as RepWorkspace
    if (!workspace) {
      throw new Error(`Workspace ${workspaceUpdate.id} does not exist`)
    }
    const updatedWorkspace = {
      ...workspace,
      ...workspaceUpdate,
    }
    workspaceSchema.parse(updatedWorkspace)
    await tx.put(workspaceUpdate.id, updatedWorkspace)
  },
}

export const useAppRep = () => {
  return useReplicache<AppMutators>({ name: APP_SPACE_ID, mutators: appMutators })
}
