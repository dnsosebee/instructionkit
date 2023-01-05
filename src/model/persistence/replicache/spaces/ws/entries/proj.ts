import { ReadTransaction } from 'replicache'
import { Project, projectSchema } from '../../../../../schema/types/project'
import { key, unkey } from '../../../key'

export const PROJECT_KEY_PREFIX = 'proj/'
export const projectKey = key(PROJECT_KEY_PREFIX)
const projectUnkey = unkey(PROJECT_KEY_PREFIX)

export const listProjects = async (tx: ReadTransaction): Promise<Project[]> => {
  return (await tx.scan({ prefix: PROJECT_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    return {
      ...projectSchema.parse(v),
      id: projectUnkey(k),
    }
  })
}

export type ProjectUpdate = { id: string } & Partial<Omit<Project, 'createdAt'>>
