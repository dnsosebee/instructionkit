import { nanoid } from 'nanoid'
import { z } from 'zod'
import { DART_ID_PREFIX, FLOEM_ID_PREFIX, FLOW_ID_PREFIX } from './idPrefixes'

export const genDartId = () => DART_ID_PREFIX + nanoid(5)

export const dartSchema = z.object({
  id: z.string().length(10).startsWith(DART_ID_PREFIX),
  floem: z.string().startsWith(FLOEM_ID_PREFIX),
  from: z.string().startsWith(FLOW_ID_PREFIX),
  to: z.string().startsWith(FLOW_ID_PREFIX),
  case: z.string(),
})

export type DataDart = z.infer<typeof dartSchema>

export type DartUpdate = Partial<DataDart> & Pick<DataDart, 'id'> & Pick<DataDart, 'floem'>

export const DEFAULT_DART_CASE = ''
