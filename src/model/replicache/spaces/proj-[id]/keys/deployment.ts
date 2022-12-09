import { z } from 'zod'
import { DEPLOYMENT_ID_LENGTH, DEPLOYMENT_ID_PREFIX } from '../projIds'

// live version is a deployed snapshot of a floem
// lets optimize for lookup speed and validation speed. In all liklihood access will be through Supabase and not through Replicache
// reasonable assumption: collaborators get Replicaches. Dartists only get access to some cloud functions / server components that have some kind of Supabase access.
// meaning its fine to have suboptimal RLS for dartists

export const deploymentIdSchema = z
  .string()
  .startsWith(DEPLOYMENT_ID_PREFIX)
  .length(DEPLOYMENT_ID_LENGTH)

export const deploymentSchema = z.object({
  id: deploymentIdSchema,
  versionId: versionIdSchema,
  createdAt: z.number(),
  live: z.boolean(),
  prettyHref: z.string().optional(),
})

export type RepDeployment = z.infer<typeof deploymentSchema>

export type DeploymentUpdate = Omit<Partial<RepDeployment>, 'createdAt'> & Pick<RepDeployment, 'id'>
