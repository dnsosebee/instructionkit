import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { genId, key } from '../../../IdsAndKeys'

const PROJECT_KEY_PREFIX = 'proj/'
export const PROJECT_ID_LENGTH = 15
export const projectSchema = z.object({
  id: z.string().length(PROJECT_ID_LENGTH),
  title: z.string().min(1).max(100),
  createdAt: z.number().int().positive(),
})
export const genProjectId = genId(PROJECT_ID_LENGTH)
export const projectKey = key(PROJECT_KEY_PREFIX)

export type RepProject = z.infer<typeof projectSchema>
export type ProjectUpdate = { id: string } & Partial<Omit<RepProject, 'createdAt'>>

export const listProjects = async (tx: ReadTransaction): Promise<RepProject[]> => {
  return (await tx.scan({ prefix: PROJECT_KEY_PREFIX }).values().toArray()) as RepProject[]
}
