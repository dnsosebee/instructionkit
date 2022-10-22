import { z } from 'zod'
import { DART_ID_LENGTH, DART_ID_PREFIX, FLOEM_ID_PREFIX, FLOW_ID_PREFIX } from './ids'

export const dartSchema = z.object({
  id: z.string().length(DART_ID_LENGTH).startsWith(DART_ID_PREFIX),
  floem: z.string().startsWith(FLOEM_ID_PREFIX),
  from: z.string().startsWith(FLOW_ID_PREFIX),
  to: z.string().startsWith(FLOW_ID_PREFIX),
  case: z.string(),
})

export type DataDart = z.infer<typeof dartSchema>

export type DartUpdate = Partial<DataDart> & Pick<DataDart, 'id'> & Pick<DataDart, 'floem'>

export const DEFAULT_DART_CASE = ''
