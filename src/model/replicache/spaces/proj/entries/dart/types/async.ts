import { z } from 'zod'
import { dartIdSchema, dartValueSchema } from '../baseDart'

export const ASYNC_DART_TYPE = 'async'

export const asyncSchema = dartValueSchema.merge(dartIdSchema).extend({
  type: z.literal(ASYNC_DART_TYPE),
})

export type AsyncDart = z.infer<typeof asyncSchema>
