import { z } from 'zod'
import { dartIdSchema, dartValueSchema } from '../baseDart'

export const GOTO_DART_TYPE = 'goto'

export const gotoSchema = dartValueSchema.merge(dartIdSchema).extend({
  type: z.literal(GOTO_DART_TYPE),
})

export type GotoDart = z.infer<typeof gotoSchema>
