import { z } from 'zod'
import { HANDLE_ID_LENGTH } from '../../../../../tiptap/flowtextExtension'
import { FLOW_ID_LENGTH } from '../flow/baseFlow'

export const DART_KEY_PREFIX = 'dart/'
export const DART_ID_LENGTH = 5

export const dartValueSchema = z.object({
  from: z.string().length(FLOW_ID_LENGTH),
  case: z.string().length(HANDLE_ID_LENGTH),
  to: z.string().length(FLOW_ID_LENGTH),
  // toHandle: z.string().length(HANDLE_ID_LENGTH).optional(),
})
export const dartIdSchema = z.object({
  id: z.string().length(DART_ID_LENGTH),
})
