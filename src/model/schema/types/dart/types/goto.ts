import { z } from 'zod'
import { baseDartSchema } from '../baseDart'

export const GOTO_DART_TYPE = 'goto'

export const gotoSchema = baseDartSchema.extend({
  type: z.literal(GOTO_DART_TYPE),
})

export type GotoDart = z.infer<typeof gotoSchema>
