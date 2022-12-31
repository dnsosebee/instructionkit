import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { genId, id, key } from '../../../../IdsAndKeys'
import { FLOW_ID_LENGTH, FLOW_KEY_PREFIX } from './baseFlow'
import { branchSchema } from './types/branch'
import { refSchema } from './types/ref'
import { startSchema } from './types/start'
import { subschema } from './types/sub'

export const genFlowId = genId(FLOW_ID_LENGTH)
export const flowKey = key(FLOW_KEY_PREFIX)
const flowId = id(FLOW_KEY_PREFIX)

export const flowSchema = z.union([branchSchema, startSchema, subschema, refSchema])

export type Flow = z.infer<typeof flowSchema>
export type FlowUpdate = Pick<Flow, 'id'> & Partial<Flow>

export const listFlows = async (tx: ReadTransaction): Promise<Flow[]> => {
  return (await tx.scan({ prefix: FLOW_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const flow = flowSchema.parse(v)
    const id = flowId(k)
    return {
      ...flow,
      id,
    }
  })
}
