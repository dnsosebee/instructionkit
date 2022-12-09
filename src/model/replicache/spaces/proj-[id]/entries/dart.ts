import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { HANDLE_ID_LENGTH } from '../../../../tiptap/flowtextExtension'
import { dependentIds, dependentKey, genId } from '../../../IdsAndKeys'
import { FLOW_ID_LENGTH } from './flow'

export const DART_KEY_PREFIX = 'dart/'
export const DART_ID_LENGTH = 5
export const dartValueSchema = z.object({
  from: z.string().length(FLOW_ID_LENGTH),
  when: z.string().length(HANDLE_ID_LENGTH),
  to: z.string().length(FLOW_ID_LENGTH),
  type: z.union([z.literal('goto'), z.literal('include'), z.literal('async')]),
})
export const dartSchema = dartValueSchema.extend({
  id: z.string().length(DART_ID_LENGTH),
})
export const genDartId = genId(DART_ID_LENGTH)
export const dartKey = dependentKey(DART_KEY_PREFIX)
const dartIds = dependentIds(DART_KEY_PREFIX)

export type RepDart = z.infer<typeof dartSchema>
export type DartUpdate = { id: string } & Partial<RepDart>

export const listDarts =
  (parent: string) =>
  async (tx: ReadTransaction): Promise<RepDart[]> => {
    const prefix = DART_KEY_PREFIX + parent + '/'
    return (await tx.scan({ prefix }).entries().toArray()).map(([k, v]) => {
      const { parent, id } = dartIds(k)
      return {
        ...dartValueSchema.parse(v),
        parent,
        id,
      }
    })
  }
