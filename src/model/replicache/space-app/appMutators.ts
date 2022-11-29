import { Replicache, WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../../logger'
import { membershipSchema, MEMBERSHIP_ID_PREFIX, RepMembership } from './membership'
import { RepWorkspace, workspaceSchema, WorkspaceUpdate } from './workspace'

const logger = parentLogger.child({ module: 'model/memberships/mutators' })

export const APP_SPACE_ID = 'app'
export type AppMutators = typeof appMutators
export type AppRep = Replicache<AppMutators>
export type AppMutate = AppRep['mutate']

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

const workspaceMutators = {
  async createWorkspace(tx: WriteTransaction, workspace: RepWorkspace) {
    logger.info('createWorkspace', workspace)
    workspaceSchema.parse(workspace)
    await tx.put(workspace.id, workspace)
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
  ...membershipMutators,
  ...workspaceMutators,
}
