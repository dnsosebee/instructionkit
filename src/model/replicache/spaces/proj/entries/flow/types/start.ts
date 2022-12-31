import { z } from 'zod'
import { flowIdSchema } from '../baseFlow'
import { branchValueSchema } from './branch'

export const START_FLOW_TYPE = 'start'

export const startValueSchema = branchValueSchema
export const startSchema = startValueSchema.merge(flowIdSchema).extend({
  type: z.literal(START_FLOW_TYPE),
})

export type StartFlow = z.infer<typeof startSchema>
