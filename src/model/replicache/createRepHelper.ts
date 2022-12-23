import { createRepApiHelper } from '../../lib/apiHelpers'
import { logger as parentLogger } from '../../lib/logger'
import { AppRep } from './spaces/app/appMutators'
import { WorkspaceRep } from './spaces/ws/workspaceMutators'

const logger = parentLogger.child({ module: 'createRepHelper.ts' })

export const createWorkspaceRepHelper = async ({
  appRep,
  workspaceId,
  userId,
}: {
  appRep: AppRep
  workspaceId: string
  userId: string
}) => {
  logger.debug('createWorkspaceRepHelper: creating workspace', { workspaceId, userId })
  if (!appRep.online) {
    logger.debug('createWorkspaceRepHelper: appRep is offline')
    return false
  }
  await Promise.all([
    appRep.mutate.createWorkspaceWithOwner({
      workspace: { id: workspaceId, name: 'My Workspace', icon: 'folder', createdAt: Date.now() },
      userId,
    }),
    createRepApiHelper({ type: 'workspace', workspaceId }),
  ])
  return true
}

export const createProjectRepHelper = async ({
  workspaceRep,
  workspaceId,
  projectId,
}: {
  workspaceRep: WorkspaceRep
  workspaceId: string
  projectId: string
}) => {
  logger.debug('createProjectRepHelper: creating project', { workspaceId, projectId })
  if (!workspaceRep.online) {
    logger.debug('createProjectRepHelper: workspaceRep is offline')
    return false
  }
  await Promise.all([
    workspaceRep.mutate.createProject({
      id: projectId,
      title: 'Untitled Project',
      createdAt: Date.now(),
    }),
    createRepApiHelper({ type: 'project', workspaceId, projectId }),
  ])
  return true
}
