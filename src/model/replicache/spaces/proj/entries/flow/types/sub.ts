import { z } from 'zod'
import { flowIdSchema, flowValueSchema } from '../baseFlow'
import { StartFlow } from './start'

export const SUB_FLOW_TYPE = 'sub'

export const subValueSchema = flowValueSchema.extend({
  title: z.string(),
})

export const subschema = subValueSchema.merge(flowIdSchema).extend({
  type: z.literal(SUB_FLOW_TYPE),
})

export type SubFlow = z.infer<typeof subschema>
export type SubCreate = { sub: SubFlow; start: StartFlow }
