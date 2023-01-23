import { z } from 'zod'
import { dartSchema } from './dart/dart'
import { flowSchema } from './flow/flow'
import { VERSION_ID_LENGTH } from './version'

export const deploymentSchema = z.object({
  versionId: z.string().length(VERSION_ID_LENGTH),
  schemaVersion: z.literal(1),
  createdAt: z.number(),
  updatedAt: z.number(),
  live: z.boolean(),
  compiled: z.object({
    // this will likely change soon: there will be different schema versions to account for changes in the compiled data structure
    flows: z.array(flowSchema),
    darts: z.array(dartSchema),
  }),
  prettyUrl: z.string().optional(),
})

export type Deployment = z.infer<typeof deploymentSchema>

// actually, no idea how compilation will work until we fix "the boat"
// const compiledScopeSchema = z.object({
//   start: z.string(), // flowtext, should be further optimized
//   branches: z.record(branchSchema.pick({ id: true }), z.string()), // flowtext, should be further optimized
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
