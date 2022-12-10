import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { HANDLE_ID_LENGTH } from '../../../../tiptap/flowtextExtension'
import { genId, id, key } from '../../../IdsAndKeys'
import { FLOW_ID_LENGTH } from './flow'

export const DART_KEY_PREFIX = 'dart/'
export const DART_ID_LENGTH = 5
export const dartValueSchema = z.object({
  from: z.string().length(FLOW_ID_LENGTH),
  fromHandle: z.string().length(HANDLE_ID_LENGTH),
  to: z.string().length(FLOW_ID_LENGTH),
  type: z.union([z.literal('goto'), z.literal('include'), z.literal('async')]),
})
export const dartSchema = dartValueSchema.extend({
  id: z.string().length(DART_ID_LENGTH),
})
export const genDartId = genId(DART_ID_LENGTH)
export const dartKey = key(DART_KEY_PREFIX)
const dartId = id(DART_KEY_PREFIX)

export type RepDart = z.infer<typeof dartSchema>
export type DartUpdate = { id: string } & Partial<RepDart>

export const listDarts = async (tx: ReadTransaction): Promise<RepDart[]> => {
  const prefix = DART_KEY_PREFIX
  return (await tx.scan({ prefix }).entries().toArray()).map(([k, v]) => {
    const id = dartId(k)
    return {
      ...dartValueSchema.parse(v),
      id,
    }
  })
}
