import { z } from 'zod'

export const FLOW_KEY_PREFIX = 'flow/'
export const FLOW_ID_LENGTH = 5

export const flowValueSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  parent: z.string().length(FLOW_ID_LENGTH).optional(),
})

export const flowIdSchema = z.object({
  id: z.string().length(FLOW_ID_LENGTH),
})
