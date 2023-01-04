import { z } from 'zod'
import { baseDartSchema } from '../baseDart'

export const ASYNC_DART_TYPE = 'async'

export const asyncSchema = baseDartSchema.extend({
  type: z.literal(ASYNC_DART_TYPE),
})

export type AsyncDart = z.infer<typeof asyncSchema>
