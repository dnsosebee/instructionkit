import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { createSpace } from 'replicache-nextjs/lib/backend'
import { Database } from '../../../src/lib/database.types'
import { genMembershipDBKey } from '../../../src/model/replicache-spaces/app/types/membership'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { workspaceId } = req.query

  if (!workspaceId) {
    return res.status(400).json({ error: 'No workspaceId provided' })
  }

  const supabase = createServerSupabaseClient<Database>({ req, res })
  const { data, error } = await supabase.auth.getSession()

  if (error || !data || !data.session) {
    res.status(401).json({ error: 'Not authenticated' })
    return
  }

  const userId = data.session.user.id
  const membershipDBKey = genMembershipDBKey(workspaceId as string, userId)

  const { data: membershipData, error: membershipError } = await supabase
    .from('entry')
    .select('value')
    .eq('key', membershipDBKey)
    .single()

  if (membershipError) {
    return res.status(500).json({ error: membershipError.message })
  }

  if (membershipData) {
    // user has authority to create a workspace
    await createSpace(workspaceId as string)
    return res.status(200).json({ success: true })
  }

  return res.status(404).json({ error: 'Membership not found' })
}
