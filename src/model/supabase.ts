import { z } from 'zod'

export const SUPABASE_USER_ID_LENGTH = 36
export const supabaseUserIdSchema = z.string().length(SUPABASE_USER_ID_LENGTH)
