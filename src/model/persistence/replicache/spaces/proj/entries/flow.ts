import { ReadTransaction } from 'replicache'
import { Flow, flowSchema } from '../../../../../schema/types/flow/flow'
import { StartFlow } from '../../../../../schema/types/flow/types/start'
import { SubFlow } from '../../../../../schema/types/flow/types/sub'
import { key, unkey } from '../../../key'

export const FLOW_KEY_PREFIX = 'flow/'
export const flowKey = key(FLOW_KEY_PREFIX)
const flowUnkey = unkey(FLOW_KEY_PREFIX)

export type SubCreate = { sub: SubFlow; start: StartFlow }

export type FlowUpdate = Pick<Flow, 'id'> & Partial<Flow>

export const listFlows = async (tx: ReadTransaction): Promise<Flow[]> => {
  return (await tx.scan({ prefix: FLOW_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    return {
      ...flowSchema.parse(v),
      id: flowUnkey(k),
    }
  })
}
