import { logger as parentLogger } from '../../../../lib/logger'
import { Project } from '../../../schema/types/project'
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
  logger.info('createWorkspaceSpaceHelper: creating workspace', { workspaceId, userId })
  if (!appRep.online) {
    logger.info('createWorkspaceSpaceHelper: appRep is offline, aborting')
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
  project,
}: {
  workspaceRep: WorkspaceRep
  workspaceId: string
  project: Project
}) => {
  logger.info('createProjectSpaceHelper: creating project', { workspaceId, project })
  if (!workspaceRep.online) {
    logger.info('createProjectSpaceHelper: workspaceRep is offline, aborting')
    return false
  }
  await Promise.all([
    workspaceRep.mutate.createProject(project),
    createRepApiHelper({ type: 'project', workspaceId, projectId: project.id }),
  ])
  return true
}
