import { logger as parentLogger } from '../../../../lib/logger'
import { AppRep } from '../spaces/app/appRep'
import { WorkspaceRep } from '../spaces/ws/workspaceRep'
import { createRepApiHelper } from './apiHelper'

const logger = parentLogger.child({ module: 'createRepHelper.ts' })

export const createWorkspaceSpaceHelper = async ({
  appRep,
  workspaceId,
  userId,
}: {
  appRep: AppRep
  workspaceId: string
  userId: string
}) => {
  logger.debug('createWorkspaceSpaceHelper: creating workspace', { workspaceId, userId })
  if (!appRep.online) {
    logger.debug('createWorkspaceSpaceHelper: appRep is offline')
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

export const createProjectSpaceHelper = async ({
  workspaceRep,
  workspaceId,
  projectId,
}: {
  workspaceRep: WorkspaceRep
  workspaceId: string
  projectId: string
}) => {
  logger.debug('createProjectSpaceHelper: creating project', { workspaceId, projectId })
  if (!workspaceRep.online) {
    logger.debug('createProjectSpaceHelper: workspaceRep is offline')
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
