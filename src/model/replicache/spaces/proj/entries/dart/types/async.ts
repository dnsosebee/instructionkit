import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { dartIdSchema, dartValueSchema, DART_KEY_PREFIX } from '../baseDart'

export const ASYNC_DART_TYPE = 'async'
export const asyncKey = key(DART_KEY_PREFIX + ASYNC_DART_TYPE + '/')

export const asyncSchema = dartValueSchema.merge(dartIdSchema).extend({
  type: z.literal(ASYNC_DART_TYPE),
})

export type AsyncDart = z.infer<typeof asyncSchema>
