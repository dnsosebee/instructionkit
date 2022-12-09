import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { id, key } from '../../../IdsAndKeys'
import { PROJECT_ID_LENGTH } from '../../ws-[id]/entries/proj'
import { dartValueSchema } from './dart'
import { flowValueSchema, FLOW_ID_LENGTH } from './flow'
import { VERSION_ID_LENGTH } from './version'

export const DEPLOYMENT_KEY_PREFIX = 'deploy/'

export const deploymentValueSchema = z.object({
  versionId: z.string().length(VERSION_ID_LENGTH),
  compiled: z.record(
    z.object({
      flowstart: z.string().length(FLOW_ID_LENGTH),
      flows: z.record(flowValueSchema),
      darts: z.record(dartValueSchema),
    }),
  ),
  createdAt: z.number(),
  live: z.boolean(),
  prettyUrl: z.string().optional(),
})
export const deploymentSchema = deploymentValueSchema.extend({
  projectId: z.string().length(PROJECT_ID_LENGTH),
})

export const deploymentKey = key(DEPLOYMENT_KEY_PREFIX)
const deploymentId = id(DEPLOYMENT_KEY_PREFIX)

export type RepDeployment = z.infer<typeof deploymentSchema>
export type DeploymentUpdate = Omit<Partial<RepDeployment>, 'createdAt'> &
  Pick<RepDeployment, 'projectId'>

export const getDeployment =
  (projectId: string) =>
  async (tx: ReadTransaction): Promise<RepDeployment | null> => {
    const k = deploymentKey(projectId)
    const v = await tx.get(k)
    if (!v) return null
    const id = deploymentId(k)
    return {
      ...deploymentValueSchema.parse(v),
      projectId: id,
    }
  }
