import { z } from 'zod'
import { baseFlowSchema } from '../baseFlow'

export const BRANCH_FLOW_TYPE = 'branch'

export const branchSchema = baseFlowSchema.extend({
  type: z.literal(BRANCH_FLOW_TYPE),
  flowtext: z.string(),
})

export type BranchFlow = z.infer<typeof branchSchema>

/**
 *
 */

export const EMPTY_BRANCH_FLOWTEXT = ''
