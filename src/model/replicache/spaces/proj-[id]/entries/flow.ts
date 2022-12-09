import { JSONContent } from '@tiptap/react'
import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { dependentIds, dependentKey, genId } from '../../../IdsAndKeys'
import { PROJECT_ID_LENGTH } from '../../ws-[id]/entries/proj'

export const FLOW_KEY_PREFIX = 'flow/'
export const FLOW_ID_LENGTH = 5

export const flowValueSchema = z.object({
  type: z.union([
    z.literal('start'),
    z.literal('branch'),
    z.literal('subflow'),
    z.literal('reference'),
  ]),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  flomNodes: z.array(z.object<JSONContent>({})),
})
export const flowSchema = flowValueSchema.extend({
  id: z.string().length(FLOW_ID_LENGTH),
  parent: z.string().length(PROJECT_ID_LENGTH),
})

export const genFlowId = genId(FLOW_ID_LENGTH)
export const flowKey = dependentKey(FLOW_KEY_PREFIX)
const flowIds = dependentIds(FLOW_KEY_PREFIX)

export type RepFlow = z.infer<typeof flowSchema>
export type FlowUpdate = { id: string } & Partial<RepFlow>

export const listFlows =
  (parentId: string) =>
  async (tx: ReadTransaction): Promise<RepFlow[]> => {
    const prefix = FLOW_KEY_PREFIX + parentId + '/'
    return (await tx.scan({ prefix }).entries().toArray()).map(([k, v]) => {
      const { parent, id } = flowIds(k)
      return {
        ...flowValueSchema.parse(v),
        parent,
        id,
      }
    })
  }
