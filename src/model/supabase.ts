import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { z } from 'zod'
import { Database } from '../lib/database.types'

export const SUPABASE_USER_ID_LENGTH = 36
export const supabaseUserIdSchema = z.string().length(SUPABASE_USER_ID_LENGTH)

// xstate action for checking supabase auth status
// expected to be used within SessionContextProvider
