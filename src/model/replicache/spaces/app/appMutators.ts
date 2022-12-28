import { Replicache, WriteTransaction } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { logger as parentLogger } from '../../../../lib/logger'
import { AcceptInvite, Invite, inviteKey, inviteSchema, INVITE_KEY_PREFIX } from './entries/inv'
import {
  Membership,
  membershipKey,
  membershipSchema,
  MEMBERSHIP_KEY_PREFIX,
} from './entries/member'
import { Workspace, workspaceKey, workspaceSchema, WorkspaceUpdate } from './entries/ws'

const logger = parentLogger.child({ module: 'appMutators' })

export const APP_SPACE_ID = 'app'

export type AppMutators = typeof appMutators
export type AppRep = Replicache<AppMutators>

export const useAppRep = () => {
  return useReplicache<AppMutators>({ name: APP_SPACE_ID, mutators: appMutators })
}

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
  async acceptInvite(tx: WriteTransaction, acceptInvite: AcceptInvite) {
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
    const inviteKeys = await tx
      .scan({ prefix: `${INVITE_KEY_PREFIX}${workspaceId}` })
      .keys()
      .toArray()
    const membershipKeys = await tx
      .scan({ prefix: `${MEMBERSHIP_KEY_PREFIX}${workspaceId}` })
      .keys()
      .toArray()
    await Promise.all([
      tx.del(workspaceKey(workspaceId)),
      ...inviteKeys.map(inviteKey => tx.del(inviteKey)),
      ...membershipKeys.map(membershipKey => tx.del(membershipKey)),
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
