import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { dartIdSchema, dartValueSchema, DART_KEY_PREFIX } from '../baseDart'

export const GOTO_DART_TYPE = 'goto'
export const gotoKey = key(DART_KEY_PREFIX + GOTO_DART_TYPE + '/')

export const gotoSchema = dartValueSchema.merge(dartIdSchema).extend({
  type: z.literal(GOTO_DART_TYPE),
})

export type RepGoto = z.infer<typeof gotoSchema>
