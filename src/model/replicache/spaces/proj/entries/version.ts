import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { genId, id, key } from '../../../IdsAndKeys'
import { dartSchema } from './dart/dart'
import { flowSchema } from './flow/flow'

export const VERSION_KEY_PREFIX = 'ver/'
export const VERSION_ID_LENGTH = 5

const versionValueSchema = z.object({
  createdAt: z.number().int().positive(),
  flows: z.array(flowSchema),
  darts: z.array(dartSchema),
})
export const versionSchema = versionValueSchema.extend({
  id: z.string().length(VERSION_ID_LENGTH),
})

export const genVersionId = genId(VERSION_ID_LENGTH)
export const versionKey = key(VERSION_KEY_PREFIX)
const flowId = id(VERSION_KEY_PREFIX)

export type Version = z.infer<typeof versionSchema>

export const listVersions = async (tx: ReadTransaction): Promise<Version[]> => {
  return (await tx.scan({ prefix: VERSION_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    return {
      ...versionValueSchema.parse(v),
      id: flowId(k),
    }
  })
}
