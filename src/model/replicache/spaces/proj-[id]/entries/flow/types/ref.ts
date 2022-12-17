import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { PROJECT_ID_LENGTH } from '../../../../ws-[id]/entries/proj'
import { flowIdSchema, flowValueSchema } from '../flow'
import { FLOW_KEY_PREFIX } from '../key'

export const REF_FLOW_TYPE = 'ref'
export const refKey = key(FLOW_KEY_PREFIX + REF_FLOW_TYPE + '/')

export const refValueSchema = flowValueSchema.extend({
  workspaceId: z.string().length(PROJECT_ID_LENGTH),
  projectId: z.string().length(PROJECT_ID_LENGTH),
})
export const refSchema = refValueSchema.merge(flowIdSchema).extend({
  type: z.literal(REF_FLOW_TYPE),
})

export type RepRef = z.infer<typeof refSchema>
