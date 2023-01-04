import { WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../../../../lib/logger'
import { Invite, inviteSchema } from '../../../../schema/types/invite'
import { Membership, membershipSchema } from '../../../../schema/types/membership'
import { Workspace, workspaceSchema } from '../../../../schema/types/workspace'
import { inviteKey, listWorkspaceInviteKeys } from './entries/inv'
import { listWorkspaceMembershipKeys, membershipKey } from './entries/member'
import { workspaceKey, WorkspaceUpdate } from './entries/ws'

const logger = parentLogger.child({ module: 'appMutators' })

export type AppMutators = typeof appMutators

export const appMutators = {
  // invites
  async createOrUpdateInvite(tx: WriteTransaction, invite: Invite) {
    logger.info('createOrUpdateInvite', invite)
    inviteSchema.parse(invite)
    await tx.put(inviteKey(invite.workspaceId, invite.email), invite.accessPolicy)
  },
  async deleteInvite(tx: WriteTransaction, invite: Invite) {
    logger.info('deleteInvite', invite)
    inviteSchema.parse(invite)
    await tx.del(inviteKey(invite.workspaceId, invite.email))
  },

  // invites and memberships
  async acceptInvite(tx: WriteTransaction, acceptInvite: { invite: Invite; userId: string }) {
    logger.info('acceptInvite', acceptInvite)
    const { invite, userId } = acceptInvite
    inviteSchema.parse(invite)
    await Promise.all([
      tx.del(inviteKey(invite.workspaceId, invite.email)),
      tx.put(membershipKey(invite.workspaceId, userId), invite.accessPolicy),
    ])
  },

  // memberships
  async deleteMembership(tx: WriteTransaction, membership: Membership) {
    logger.info('deleteMembership', membership)
    membershipSchema.parse(membership)
    await tx.del(membershipKey(membership.workspaceId, membership.userId))
  },

  // memberships and workspaces
  async createWorkspaceWithOwner(
    tx: WriteTransaction,
    data: { workspace: Workspace; userId: string },
  ) {
    logger.info('createWorkspaceWithOwner', data)
    const { workspace, userId } = data
    const membership = {
      workspaceId: workspace.id,
      userId,
      accessPolicy: 'owner',
    }
    membershipSchema.parse(membership)
    // ensure workspace doesn't already exist
    const wsKey = workspaceKey(workspace.id)
    const existingWorkspace = await tx.get(wsKey)
    if (existingWorkspace) {
      throw new Error(`Workspace ${workspace.id} already exists`)
    }
    await Promise.all([
      tx.put(wsKey, workspaceSchema.parse(workspace)),
      tx.put(membershipKey(workspace.id, userId), membership.accessPolicy),
    ])
  },

  // workspaces
  async deleteWorkspace(tx: WriteTransaction, workspaceId: string) {
    logger.info('deleteWorkspace', workspaceId)
    const inviteKeys = await listWorkspaceInviteKeys(tx, workspaceId)
    const membershipKeys = await listWorkspaceMembershipKeys(tx, workspaceId)
    await Promise.all([
      ...inviteKeys.map(inviteKey => tx.del(inviteKey)),
      ...membershipKeys.map(membershipKey => tx.del(membershipKey)),
      tx.del(workspaceKey(workspaceId)),
    ])
  },

  async updateWorkspace(tx: WriteTransaction, workspaceUpdate: WorkspaceUpdate) {
    logger.info('updateWorkspace', workspaceUpdate)
    const key = workspaceKey(workspaceUpdate.id)
    const workspace = (await tx.get(key)) as Workspace
    if (!workspace) {
      throw new Error(`Workspace ${workspaceUpdate.id} does not exist`)
    }
    const updatedWorkspace = {
      ...workspace,
      ...workspaceUpdate,
    }
    await tx.put(key, workspaceSchema.parse(updatedWorkspace))
  },
}
