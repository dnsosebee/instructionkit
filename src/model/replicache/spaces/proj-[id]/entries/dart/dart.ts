import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { HANDLE_ID_LENGTH } from '../../../../../tiptap/flowtextExtension'
import { genId, scopedIds, scopedKey } from '../../../../IdsAndKeys'
import { FLOW_ID_LENGTH } from '../flow/flow'
import { asyncSchema } from './types/async'
import { gotoSchema } from './types/goto'
import { includeSchema } from './types/incl'

export const DART_KEY_PREFIX = 'dart/'
export const DART_ID_LENGTH = 10

export const dartValueSchema = z.object({
  from: z.string().length(FLOW_ID_LENGTH),
  fromHandle: z.string().length(HANDLE_ID_LENGTH),
  to: z.string().length(FLOW_ID_LENGTH),
  toHandle: z.string().length(HANDLE_ID_LENGTH).optional(),
})
export const dartIdSchema = z.object({
  id: z.string().length(DART_ID_LENGTH),
})

export const genDartId = genId(DART_ID_LENGTH)
export const dartKey = scopedKey(DART_KEY_PREFIX) as (type: string, id: string) => string
const dartIds = scopedIds(DART_KEY_PREFIX)

export const dartSchema = z.union([gotoSchema, asyncSchema, includeSchema])

export type RepDart = z.infer<typeof dartSchema>

export const listDarts = async (tx: ReadTransaction): Promise<RepDart[]> => {
  return (await tx.scan({ prefix: DART_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const { id, parent: type } = dartIds(k)
    switch (type) {
      case 'goto':
        return {
          ...dartValueSchema.parse(v),
          id,
          type,
        }
      case 'async':
        return {
          ...dartValueSchema.parse(v),
          id,
          type,
        }
      case 'incl':
        return {
          ...dartValueSchema.parse(v),
          id,
          type,
        }
      default:
        throw new Error(`Unknown dart type: ${type}`)
    }
  })
}
