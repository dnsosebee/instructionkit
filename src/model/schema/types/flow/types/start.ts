import { z } from 'zod'
import { baseFlowSchema } from '../baseFlow'

export const START_FLOW_TYPE = 'start'

export const startSchema = baseFlowSchema.extend({
  type: z.literal(START_FLOW_TYPE),
})

export type StartFlow = z.infer<typeof startSchema>
