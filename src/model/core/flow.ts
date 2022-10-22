import { nanoid } from 'nanoid'
import { z } from 'zod'
import { FLOEM_ID_PREFIX, FLOW_ID_PREFIX } from './idPrefixes'

export const FLOW_START_ID = 'flow-start'

export const genFlowId = () => FLOW_ID_PREFIX + nanoid(5)

export const flowSchema = z.object({
  id: z.string().startsWith(FLOW_ID_PREFIX).length(10),
  floem: z.string().startsWith(FLOEM_ID_PREFIX),
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
