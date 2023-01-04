import { z } from 'zod'
import { genId } from '../../id'

export const FLOW_ID_LENGTH = 5
export const genFlowId = genId(FLOW_ID_LENGTH)

export const baseFlowSchema = z.object({
  id: z.string().length(FLOW_ID_LENGTH),
  parent: z.string().length(FLOW_ID_LENGTH).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
})
