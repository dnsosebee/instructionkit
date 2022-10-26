import { z } from 'zod'
import { FLOW_ID_LENGTH, FLOW_ID_PREFIX } from './ids'

export const flowSchema = z.object({
  id: z.string().startsWith(FLOW_ID_PREFIX).length(FLOW_ID_LENGTH),
  flowtext: z.string(),
  createdAt: z.number(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
})

export type DataFlow = z.infer<typeof flowSchema>

export type FlowUpdate = Partial<DataFlow> & Pick<DataFlow, 'id'> & { floem: string }

export const DEFAULT_FLOWTEXT = '<p></p>'
