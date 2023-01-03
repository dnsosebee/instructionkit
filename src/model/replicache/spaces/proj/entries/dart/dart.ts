import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { genId } from '../../../../IdsAndKeys'
import { DART_ID_LENGTH } from './baseDart'
import { asyncSchema } from './types/async'
import { gotoSchema } from './types/goto'
import { includeSchema } from './types/incl'

export const genDartId = genId(DART_ID_LENGTH)
export const DARTS_KEY = 'darts'

export const dartSchema = z.union([gotoSchema, asyncSchema, includeSchema])
export const dartsSchema = z.array(dartSchema)

export type Dart = z.infer<typeof dartSchema>

export const listDarts = async (tx: ReadTransaction): Promise<Dart[]> => {
  return ((await tx.get(DARTS_KEY)) || []) as Dart[]
}
