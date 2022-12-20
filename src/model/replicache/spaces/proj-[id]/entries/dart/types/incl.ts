import { z } from 'zod'
import { key } from '../../../../../IdsAndKeys'
import { dartIdSchema, dartValueSchema, DART_KEY_PREFIX } from '../baseDart'

export const INCLUDE_DART_TYPE = 'incl'
export const includeKey = key(DART_KEY_PREFIX + INCLUDE_DART_TYPE + '/')

export const includeSchema = dartValueSchema.merge(dartIdSchema).extend({
  type: z.literal(INCLUDE_DART_TYPE),
})

export type RepInclude = z.infer<typeof includeSchema>
