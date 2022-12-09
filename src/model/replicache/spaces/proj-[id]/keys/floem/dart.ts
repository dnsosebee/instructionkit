import { z } from 'zod'
import { CASE_ID_LENGTH, DART_ID_LENGTH, DART_ID_PREFIX } from '../../projIds'
import { flowIdSchema } from './flow'

export const dartSchema = z.object({
  id: z.string().length(DART_ID_LENGTH).startsWith(DART_ID_PREFIX),
  from: flowIdSchema,
  case: z.string().length(CASE_ID_LENGTH),
  to: flowIdSchema,
})

export type DataDart = z.infer<typeof dartSchema>

export type DartUpdate = Partial<DataDart> & Pick<DataDart, 'id'> & { floem: string }
