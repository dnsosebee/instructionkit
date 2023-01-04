import { z } from 'zod'
import { asyncSchema } from './types/async'
import { gotoSchema } from './types/goto'
import { includeSchema } from './types/incl'

export const dartSchema = z.union([gotoSchema, asyncSchema, includeSchema])
export const dartsSchema = z.array(dartSchema)

export type Dart = z.infer<typeof dartSchema>
