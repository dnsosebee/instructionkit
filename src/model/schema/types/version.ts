import { z } from 'zod'
import { genId } from '../id'
import { dartSchema } from './dart/dart'
import { flowSchema } from './flow/flow'

export const VERSION_ID_LENGTH = 5
export const genVersionId = genId(VERSION_ID_LENGTH)

export const versionSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().length(VERSION_ID_LENGTH),
  createdAt: z.number().int().positive(),
  flows: z.array(flowSchema),
  darts: z.array(dartSchema),
})

export type Version = z.infer<typeof versionSchema>
