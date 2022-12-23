import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { VERSION_ID_LENGTH } from './version'

export const DEPLOYMENT_KEY = 'deploy'

// actually, no idea how compilation will work until we fix "the boat"
// const compiledScopeSchema = z.object({
//   start: flomNodesSchema,
//   branches: z.record(branchSchema.pick({ id: true }), flomNodesSchema),
//   darts: z.record(
//     dartValueSchema.pick({ from: true }),
//     z.record(
//       dartValueSchema.pick({ fromHandle: true }),
//       dartValueSchema.pick({ to: true, toHandle: true }).extend({
//         type: z.union([
//           gotoSchema.pick({ type: true }),
//           asyncSchema.pick({ type: true }),
//           includeSchema.pick({ type: true }),
//         ]),
//       }),
//     ),
//   ),
// })

export const deploymentSchema = z.object({
  versionId: z.string().length(VERSION_ID_LENGTH),
  // compiled: z.object({
  //   initial: compiledScopeSchema,
  //   scopes: z.record(),
  // }),
  createdAt: z.number(),
  updatedAt: z.number(),
  live: z.boolean(),
  prettyUrl: z.string().optional(),
})

export type RepDeployment = z.infer<typeof deploymentSchema>
export type DeploymentUpdate = Omit<Partial<RepDeployment>, 'createdAt'>

export const getDeployment = async (tx: ReadTransaction): Promise<RepDeployment | null> => {
  const v = await tx.get(DEPLOYMENT_KEY)
  return deploymentSchema.parse(v)
}
