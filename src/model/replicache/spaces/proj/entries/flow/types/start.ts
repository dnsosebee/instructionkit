import { z } from 'zod'
import { flowIdSchema, flowValueSchema } from '../baseFlow'

export const START_FLOW_TYPE = 'start'

export const startValueSchema = flowValueSchema
export const startSchema = startValueSchema.merge(flowIdSchema).extend({
  type: z.literal(START_FLOW_TYPE),
})

export type StartFlow = z.infer<typeof startSchema>
