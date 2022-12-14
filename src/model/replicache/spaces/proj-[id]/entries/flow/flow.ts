import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { genId, scopedIds, scopedKey } from '../../../../IdsAndKeys'
import { branchSchema, branchValueSchema, BRANCH_FLOW_TYPE } from './types/branch'
import { refSchema, refValueSchema, REF_FLOW_TYPE } from './types/ref'
import { startSchema, startValueSchema, START_FLOW_TYPE } from './types/start'
import { subschema, subValueSchema, SUB_FLOW_TYPE } from './types/sub'

export const FLOW_ID_LENGTH = 10
export const FLOW_KEY_PREFIX = 'flow/'
export const genFlowId = genId(FLOW_ID_LENGTH)
export const flowKey = scopedKey(FLOW_KEY_PREFIX) as (type: string, id: string) => string
const flowIds = scopedIds(FLOW_KEY_PREFIX)

export const flowValueSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  parent: z.string().length(FLOW_ID_LENGTH).optional(),
})

export const flowIdSchema = z.object({
  id: z.string().length(FLOW_ID_LENGTH),
})

export const flowSchema = z.union([branchSchema, startSchema, subschema, refSchema])

export type RepFlow = z.infer<typeof flowSchema>
export type FlowPositionUpdate = Pick<RepFlow, 'id' | 'type' | 'position'>
export type FlowRemove = Pick<RepFlow, 'id' | 'type'>

export const listFlows = async (tx: ReadTransaction): Promise<RepFlow[]> => {
  return (await tx.scan({ prefix: FLOW_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const { id, parent: type } = flowIds(k)
    switch (type) {
      case BRANCH_FLOW_TYPE:
        return {
          ...branchValueSchema.parse(v),
          id,
          type,
        }
      case START_FLOW_TYPE:
        return {
          ...startValueSchema.parse(v),
          id,
          type,
        }
      case SUB_FLOW_TYPE:
        return {
          ...subValueSchema.parse(v),
          id,
          type,
        }
      case REF_FLOW_TYPE:
        return {
          ...refValueSchema.parse(v),
          id,
          type,
        }
      default:
        throw new Error(`Unknown flow type: ${type}`)
    }
  })
}
