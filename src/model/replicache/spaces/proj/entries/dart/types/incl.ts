import { z } from 'zod'
import { dartIdSchema, dartValueSchema } from '../baseDart'

export const INCLUDE_DART_TYPE = 'incl'

export const includeSchema = dartValueSchema.merge(dartIdSchema).extend({
  type: z.literal(INCLUDE_DART_TYPE),
})

export type IncludeDart = z.infer<typeof includeSchema>
