import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { flowIdSchema, FLOW_KEY_PREFIX } from '../flow'
import { branchValueSchema } from './branch'

export const START_FLOW_TYPE = 'start'
export const startKey = key(FLOW_KEY_PREFIX + START_FLOW_TYPE + '/')

export const startValueSchema = branchValueSchema
export const startSchema = startValueSchema.merge(flowIdSchema).extend({
  type: z.literal(START_FLOW_TYPE),
})

export type RepStart = z.infer<typeof startSchema>
