import { z } from 'zod'
import { FLOEM_ID_LENGTH, FLOEM_ID_PREFIX, FLOW_ID_LENGTH, FLOW_ID_PREFIX } from './ids'

export const flowSchema = z.object({
  id: z.string().startsWith(FLOW_ID_PREFIX).length(FLOW_ID_LENGTH),
  floem: z.string().startsWith(FLOEM_ID_PREFIX).length(FLOEM_ID_LENGTH),
  flowtext: z.string(),
  createdAt: z.number(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
})

export type DataFlow = z.infer<typeof flowSchema>

export type FlowUpdate = Partial<DataFlow> & Pick<DataFlow, 'id'> & Pick<DataFlow, 'floem'>

export const DEFAULT_FLOWTEXT = '<p></p>'
