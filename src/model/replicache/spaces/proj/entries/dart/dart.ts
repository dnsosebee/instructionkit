import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { genId, id, key } from '../../../../IdsAndKeys'
import { DART_ID_LENGTH, DART_KEY_PREFIX } from './baseDart'
import { asyncSchema } from './types/async'
import { gotoSchema } from './types/goto'
import { includeSchema } from './types/incl'

export const genDartId = genId(DART_ID_LENGTH)
export const dartKey = key(DART_KEY_PREFIX)
const dartId = id(DART_KEY_PREFIX)

export const dartSchema = z.union([gotoSchema, asyncSchema, includeSchema])

export type Dart = z.infer<typeof dartSchema>

export const listDarts = async (tx: ReadTransaction): Promise<Dart[]> => {
  return (await tx.scan({ prefix: DART_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    const dart = dartSchema.parse(v)
    const id = dartId(k)
    return {
      ...dart,
      id,
    }
  })
}
