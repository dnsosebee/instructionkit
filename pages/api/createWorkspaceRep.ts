import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { createSpace, spaceExists } from 'replicache-nextjs/lib/backend'
import { Database } from '../../src/lib/database.types'
import { logger as parentLogger } from '../../src/logger'
import { membershipKey } from '../../src/model/replicache/spaces/app/entries/member'

const logger = parentLogger.child({ module: 'getOrCreateWorkspaceSpace.ts' })

export const signinRedirect = {
  redirect: {
    destination: '/signin',
    permanent: false,
  },
}

export type WorkspaceIdIfExists = {
  workspaceId: string | null
}

export default async (req: NextApiRequest, res: NextApiResponse<{ message: string }>) => {
  const { workspaceId } = req.query as { workspaceId: string }

  if (await spaceExists(workspaceId)) {
    logger.info('space exists')
    return res.status(200).json({ message: 'space exists' })
  }

  // no? then we need to check if the user has authority to create a workspace
  const supabase = createServerSupabaseClient<Database>({ req, res })
  const { data, error } = await supabase.auth.getSession()
  if (error || !data || !data.session) {
    logger.info('getOrCreateWorkspaceSpace: no session')
    return res.status(401).json({ message: 'no session' })
  }

  const userId = data.session.user.id
  const membershipDBKey = membershipKey(workspaceId as string, userId)

  const { data: membershipData, error: membershipError } = await supabase
    // get the value of the row in entry table that has key = membershipDBKey
    .from('entry')
    .select('value')
    .eq('key', membershipDBKey)
    .single()

  if (membershipError || !membershipData) {
    if (membershipError) {
      logger.info(`For membership ${membershipDBKey} got error ${membershipError.message}`)
      return res.status(500).json({ message: 'membership error' })
    } else {
      logger.info('getOrCreateWorkspaceSpace: no membership')
      return res.status(200).json({ message: 'no membership' })
    }
  }
  await createSpace(workspaceId as string)
  logger.info('getOrCreateWorkspaceSpace: created space', { workspaceId })
  return res.status(200).json({ message: 'created space' })
}

export const createWorkspaceRepHelper = async (workspaceId: string) =>
  fetch('/api/createWorkspace', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workspaceId,
    }),
  }).then(res => res.json() as Promise<{ message: string }>)
