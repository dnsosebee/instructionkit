import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { flowIdSchema, flowValueSchema, FLOW_KEY_PREFIX } from '../baseFlow'

export const BRANCH_FLOW_TYPE = 'branch'
export const branchKey = key(FLOW_KEY_PREFIX + BRANCH_FLOW_TYPE + '/')

export const branchValueSchema = flowValueSchema.extend({
  flowtext: z.string(),
})
export const branchSchema = branchValueSchema.merge(flowIdSchema).extend({
  type: z.literal(BRANCH_FLOW_TYPE),
})

export type BranchFlow = z.infer<typeof branchSchema>

export const EMPTY_BRANCH_FLOWTEXT = ''
