import { JSONContent } from '@tiptap/react'
import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { flowIdSchema, flowValueSchema, FLOW_KEY_PREFIX } from '../flow'

export const BRANCH_FLOW_TYPE = 'branch'
export const branchKey = key(FLOW_KEY_PREFIX + BRANCH_FLOW_TYPE + '/')

export const flomNodesSchema = z.array(z.object<JSONContent>({}))
export const branchValueSchema = flowValueSchema.extend({
  flomNodes: flomNodesSchema,
})
export const branchSchema = branchValueSchema.merge(flowIdSchema).extend({
  type: z.literal(BRANCH_FLOW_TYPE),
})

export type RepBranch = z.infer<typeof branchSchema>
