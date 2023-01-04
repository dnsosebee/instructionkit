import { z } from 'zod'
import { baseFlowSchema } from '../baseFlow'

export const SUB_FLOW_TYPE = 'sub'

export const subschema = baseFlowSchema.extend({
  title: z.string(),
  type: z.literal(SUB_FLOW_TYPE),
})

export type SubFlow = z.infer<typeof subschema>
