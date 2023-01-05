import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { createSpace, spaceExists } from 'replicache-nextjs/lib/backend'
import { ZodError } from 'zod'
import { logger as parentLogger } from '../../../src/lib/logger'
import { createRepBodySchema } from '../../../src/model/persistence/replicache/createSpace/apiHelper'
import { projectSpaceId } from '../../../src/model/persistence/replicache/spaces/proj/projectRep'
import { workspaceSpaceId } from '../../../src/model/persistence/replicache/spaces/ws/workspaceRep'
import { Database } from '../../../src/model/persistence/supabase/database.types'

const logger = parentLogger.child({ module: 'createRep.ts' })

export default async (req: NextApiRequest, res: NextApiResponse<{ message: string }>) => {
  try {
    createRepBodySchema.parse(req.body)
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return res.status(400).json({ message: e.message })
    }
    throw e
  }

  let spaceId: string
  switch (req.body.type) {
    case 'workspace':
      spaceId = workspaceSpaceId(req.body.workspaceId)
      break
    case 'project':
      spaceId = projectSpaceId(req.body.workspaceId, req.body.projectId)
      break
    default:
      return res.status(400).json({ message: `invalid type ${req.body.type}` })
  }
  if (!spaceId) {
    return res.status(400).json({ message: 'spaceId is required' })
  }

  if (await spaceExists(spaceId)) {
    return res.status(200).json({ message: `space ${spaceId} already exists` })
  }

  // no? then we need to check if the user has authority to create a workspace
  const supabase = createServerSupabaseClient<Database>({ req, res })
  const { data, error } = await supabase.auth.getSession()
  if (error || !data || !data.session) {
    logger.info('no session')
    return res.status(401).json({ message: 'no session' })
  }

  // WARNING: commenting this out because security is a hard problem to solve later
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
  await createSpace(spaceId)
  return res.status(200).json({ message: `created space ${spaceId}` })
}
