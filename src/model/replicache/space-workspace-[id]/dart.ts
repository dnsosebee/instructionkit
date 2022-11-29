import { z } from 'zod'
import { CASE_ID_LENGTH, DART_ID_LENGTH, DART_ID_PREFIX, FLOW_ID_PREFIX } from './ids'

export const dartSchema = z.object({
  id: z.string().length(DART_ID_LENGTH).startsWith(DART_ID_PREFIX),
  from: z.string().startsWith(FLOW_ID_PREFIX),
  case: z.string().length(CASE_ID_LENGTH),
  to: z.string().startsWith(FLOW_ID_PREFIX),
})

export type DataDart = z.infer<typeof dartSchema>

export type DartUpdate = Partial<DataDart> & Pick<DataDart, 'id'> & { floem: string }
