import { z } from 'zod'
import { PROJECT_ID_LENGTH } from '../../project'
import { baseFlowSchema } from '../baseFlow'

export const REF_FLOW_TYPE = 'ref'

export const refSchema = baseFlowSchema.extend({
  workspaceId: z.string().length(PROJECT_ID_LENGTH),
  projectId: z.string().length(PROJECT_ID_LENGTH),
  type: z.literal(REF_FLOW_TYPE),
})

export type RefFlow = z.infer<typeof refSchema>
