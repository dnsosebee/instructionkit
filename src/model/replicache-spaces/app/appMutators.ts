import { Replicache, WriteTransaction } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { logger as parentLogger } from '../../../logger'
import { AcceptInvite, inviteSchema, INVITE_ID_PREFIX, RepInvite } from './types/invite'
import { membershipSchema, MEMBERSHIP_ID_PREFIX, RepMembership } from './types/membership'
import { RepWorkspace, workspaceSchema, WorkspaceUpdate } from './types/workspace'

const logger = parentLogger.child({ module: 'model/memberships/mutators' })

export const APP_SPACE_ID = 'app'
export type AppMutators = typeof appMutators
export type AppRep = Replicache<AppMutators>
export type AppMutate = AppRep['mutate']

// invites
const inviteMutators = {
  async createOrUpdateInvite(tx: WriteTransaction, invite: RepInvite) {
    logger.info('createOrUpdateInvite', invite)
    inviteSchema.parse(invite)
    await tx.put(`${INVITE_ID_PREFIX}${invite.workspaceId}/${invite.email}`, invite.accessPolicy)
  },
  async deleteInvite(tx: WriteTransaction, invite: RepInvite) {
    logger.info('deleteInvite', invite)
    await tx.del(`${INVITE_ID_PREFIX}${invite.workspaceId}/${invite.email}`)
  },
  async acceptInvite(tx: WriteTransaction, acceptInvite: AcceptInvite) {
    logger.info('acceptInvite', acceptInvite)
    const { invite, userId } = acceptInvite
    await tx.del(`${INVITE_ID_PREFIX}${invite.workspaceId}/${invite.email}`)
    await tx.put(`${MEMBERSHIP_ID_PREFIX}${invite.workspaceId}/${userId}`, invite.accessPolicy)
  },
}

// memberships
const membershipMutators = {
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

// workspaces
const workspaceMutators = {
  async createWorkspace(tx: WriteTransaction, workspace: RepWorkspace) {
    logger.info('createWorkspace', workspace)
    workspaceSchema.parse(workspace)
    await tx.put(workspace.id, workspace)
  },

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
    membershipSchema.parse(membership)
    await tx.put(workspace.id, workspace)
    await tx.put(`${MEMBERSHIP_ID_PREFIX}${membership.workspaceId}/${userId}`, 'owner')
  },

  async deleteWorkspace(tx: WriteTransaction, workspaceId: string) {
    logger.info('deleteWorkspace', workspaceId)
    await tx.del(workspaceId)
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

export const appMutators = {
  ...inviteMutators,
  ...membershipMutators,
  ...workspaceMutators,
}

export const useAppReplicache = () => {
  const rep = useReplicache<AppMutators>({ name: APP_SPACE_ID, mutators: appMutators })
  return rep
}
