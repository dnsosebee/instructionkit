import { z } from 'zod'
import { baseDartSchema } from '../baseDart'

export const INCLUDE_DART_TYPE = 'incl'

export const includeSchema = baseDartSchema.extend({
  type: z.literal(INCLUDE_DART_TYPE),
})

export type IncludeDart = z.infer<typeof includeSchema>
