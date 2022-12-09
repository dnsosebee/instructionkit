import { Replicache, WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../../../logger'
import { WORKSPACE_KEY_PREFIX } from '../app/entries/ws'
import { projectKey, projectSchema, ProjectUpdate, RepProject } from './entries/proj'

const logger = parentLogger.child({ module: 'workspaceMutators' })

export const WORKSPACE_SPACE_PREFIX = WORKSPACE_KEY_PREFIX
export type WorkspaceMutators = typeof workspaceMutators
export type WorkspaceRep = Replicache<WorkspaceMutators>

const workspaceMutators = {
  // projects
  async createProject(tx: WriteTransaction, project: RepProject) {
    logger.info('createProject', project)
    const key = projectKey(project.id)
    const existing = (await tx.get(key)) as RepProject | undefined
    if (existing) {
      throw new Error(`Project ${project.id} already exists`)
    }
    await tx.put(key, projectSchema.parse(project))
  },

  async updateProject(tx: WriteTransaction, update: ProjectUpdate) {
    logger.info('updateProject', update)
    const key = projectKey(update.id)
    const existing = (await tx.get(key)) as RepProject | undefined
    if (!existing) {
      throw new Error(`Project ${update.id} does not exist`)
    }
    const updatedProject = { ...existing, ...update }
    await tx.put(key, projectSchema.parse(updatedProject))
  },

  async deleteProject(tx: WriteTransaction, project: RepProject) {
    logger.info('deleteProject', project)
    const key = projectKey(project.id)
    await tx.del(key)
  },
}
