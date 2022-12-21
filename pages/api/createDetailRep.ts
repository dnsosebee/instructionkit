import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { createSpace, spaceExists } from 'replicache-nextjs/lib/backend'
import { Database } from '../../src/lib/database.types'
import { logger as parentLogger } from '../../src/lib/logger'

const logger = parentLogger.child({ module: 'createDetailRep.ts' })

export default async (req: NextApiRequest, res: NextApiResponse<{ message: string }>) => {
  const { spaceKey } = req.query as { spaceKey: string }

  if (await spaceExists(spaceKey)) {
    logger.info('space exists')
    return res.status(200).json({ message: 'space exists' })
  }

  // no? then we need to check if the user has authority to create a workspace
  const supabase = createServerSupabaseClient<Database>({ req, res })
  const { data, error } = await supabase.auth.getSession()
  if (error || !data || !data.session) {
    logger.info('no session')
    return res.status(401).json({ message: 'no session' })
  }

  // commenting this out because security is a hard problem to solve later
  // const userId = data.session.user.id
  // const membershipDBKey = membershipKey(workspaceId as string, userId)

  // const { data: membershipData, error: membershipError } = await supabase
  //   // get the value of the row in entry table that has key = membershipDBKey
  //   .from('entry')
  //   .select('value')
  //   .eq('key', membershipDBKey)
  //   .single()

  // if (membershipError || !membershipData) {
  //   if (membershipError) {
  //     logger.info(`For membership ${membershipDBKey} got error ${membershipError.message}`)
  //     return res.status(500).json({ message: 'membership error' })
  //   } else {
  //     logger.info('getOrCreateWorkspaceSpace: no membership')
  //     return res.status(200).json({ message: 'no membership' })
  //   }
  // }
  await createSpace(spaceKey)
  logger.info('created space', { spaceKey })
  return res.status(200).json({ message: 'created space' })
}

export const createDetailRepHelper = async (spaceKey: string) =>
  fetch('/api/createDetailRep', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spaceKey,
    }),
  }).then(res => res.json() as Promise<{ message: string }>)
