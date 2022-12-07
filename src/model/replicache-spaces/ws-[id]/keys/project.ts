import { z } from 'zod'
import { genFloemId, PROJECT_ID_LENGTH, PROJECT_ID_PREFIX } from '../ids'
import { deploymentIdSchema } from './deployment'
import { DataFloem, floemIdSchema, STARTER_FLOEM } from './floem/floem'

export const projectSchema = z.object({
  id: z.string().startsWith(PROJECT_ID_PREFIX).length(PROJECT_ID_LENGTH),
  draftId: floemIdSchema,
  versionIds: z.array(floemIdSchema),
  deploymentId: deploymentIdSchema.optional(),
  createdAt: z.number(),
})

export type RepProject = z.infer<typeof projectSchema>

export type ProjectUpdate = Omit<Partial<RepProject>, 'createdAt'> & Pick<RepProject, 'id'>

export const STARTER_PROJECT_AND_FLOEM = (
  id: string,
): { project: RepProject; floem: DataFloem } => {
  const floemId = genFloemId()
  const floem = STARTER_FLOEM(floemId)
  return {
    project: {
      id,
      draftId: floemId,
      versionIds: [],
      createdAt: Date.now(),
    },
    floem,
  }
}
