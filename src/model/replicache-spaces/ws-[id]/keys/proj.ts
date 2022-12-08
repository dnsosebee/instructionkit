import { z } from 'zod'
import { DataFloem, STARTER_FLOEM } from '../../proj-[id]/keys/floem/floem'
import { genFloemId, PROJECT_ID_LENGTH, PROJECT_ID_PREFIX } from '../../proj-[id]/projIds'

export const projectSchema = z.object({
  id: z.string().startsWith(PROJECT_ID_PREFIX).length(PROJECT_ID_LENGTH),
  title: z.string(),
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
      title: 'Untitled Project',
      createdAt: Date.now(),
    },
    floem,
  }
}
