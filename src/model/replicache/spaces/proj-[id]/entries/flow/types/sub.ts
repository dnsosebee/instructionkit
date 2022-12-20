import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { flowIdSchema, flowValueSchema, FLOW_KEY_PREFIX } from '../baseFlow'
import { RepStart } from './start'

export const SUB_FLOW_TYPE = 'sub'
export const subKey = key(FLOW_KEY_PREFIX + SUB_FLOW_TYPE + '/')

export const subValueSchema = flowValueSchema.extend({
  title: z.string(),
})

export const subschema = subValueSchema.merge(flowIdSchema).extend({
  type: z.literal(SUB_FLOW_TYPE),
})

export type RepSub = z.infer<typeof subschema>
export type SubCreate = { sub: RepSub; start: RepStart }
