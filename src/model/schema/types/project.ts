import { z } from 'zod'
import { genId } from '../id'

export const PROJECT_ID_LENGTH = 7
export const genProjectId = genId(PROJECT_ID_LENGTH)

const projectValueSchema = z.object({
  id: z.string().length(PROJECT_ID_LENGTH),
  title: z.string().min(1).max(100),
  createdAt: z.number().int().positive(),
})
export const projectSchema = projectValueSchema.extend({
  id: z.string().length(PROJECT_ID_LENGTH),
})

export type Project = z.infer<typeof projectSchema>
