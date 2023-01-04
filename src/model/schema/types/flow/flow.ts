import { z } from 'zod'
import { branchSchema } from './types/branch'
import { refSchema } from './types/ref'
import { startSchema } from './types/start'
import { subschema } from './types/sub'

export const flowSchema = z.union([branchSchema, startSchema, subschema, refSchema])

export type Flow = z.infer<typeof flowSchema>
