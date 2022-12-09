import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { dependentIds, dependentKey, genId } from '../../../IdsAndKeys'
import { PROJECT_ID_LENGTH } from '../../ws-[id]/entries/proj'
import { dartSchema } from './dart'
import { flowSchema } from './flow'

export const VERSION_KEY_PREFIX = 'ver/'
export const VERSION_ID_LENGTH = 5

const versionValueSchema = z.object({
  createdAt: z.number().int().positive(),
  flows: z.array(flowSchema),
  darts: z.array(dartSchema),
})
export const versionSchema = versionValueSchema.extend({
  id: z.string().length(VERSION_ID_LENGTH),
  project: z.string().length(PROJECT_ID_LENGTH),
})

export const genVersionId = genId(VERSION_ID_LENGTH)
export const versionKey = dependentKey(VERSION_KEY_PREFIX)
const flowIds = dependentIds(VERSION_KEY_PREFIX)

export type RepVersion = z.infer<typeof versionSchema>
export type VersionUpdate = { id: string } & Partial<RepVersion>

export const listVersions =
  (projectId: string) =>
  async (tx: ReadTransaction): Promise<RepVersion[]> => {
    const prefix = VERSION_KEY_PREFIX + projectId + '/'
    return (await tx.scan({ prefix }).entries().toArray()).map(([k, v]) => {
      const { parent: project, id } = flowIds(k)
      return {
        ...versionValueSchema.parse(v),
        project,
        id,
      }
    })
  }
