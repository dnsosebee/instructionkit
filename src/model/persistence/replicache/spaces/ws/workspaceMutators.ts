import { WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../../../../lib/logger'
import { Project, projectSchema } from '../../../../schema/types/project'
import { projectKey, ProjectUpdate } from './entries/proj'

const logger = parentLogger.child({ module: 'workspaceMutators' })

export type WorkspaceMutators = typeof workspaceMutators

export const workspaceMutators = {
  // projects
  async createProject(tx: WriteTransaction, project: Project) {
    logger.info('createProject', project)
    const key = projectKey(project.id)
    const existing = (await tx.get(key)) as Project | undefined
    if (existing) {
      throw new Error(`Project ${project.id} already exists`)
    }
    await tx.put(key, projectSchema.parse(project))
  },

  async updateProject(tx: WriteTransaction, update: ProjectUpdate) {
    logger.info('updateProject', update)
    const key = projectKey(update.id)
    const existing = (await tx.get(key)) as Project | undefined
    if (!existing) {
      throw new Error(`Project ${update.id} does not exist`)
    }
    const updatedProject = { ...existing, ...update }
    await tx.put(key, projectSchema.parse(updatedProject))
  },

  async deleteProject(tx: WriteTransaction, projectId: string) {
    logger.info('deleteProject', projectId)
    const key = projectKey(projectId)
    await tx.del(key)
  },
}
