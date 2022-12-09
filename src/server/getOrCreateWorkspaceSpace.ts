import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'
import { createSpace, spaceExists } from 'replicache-nextjs/lib/backend'
import { Database } from '../lib/database.types'
import { logger as parentLogger } from '../logger'
import { membershipKey } from '../model/replicache/spaces/app/entries/member'

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

// only use in routes that specify workspaceId
export const getOrCreateWorkspaceSpace: GetServerSideProps<WorkspaceIdIfExists> = async context => {
  const { workspaceId } = context.query as { workspaceId: string }

  if (await spaceExists(workspaceId)) {
    logger.info('space exists')
    return { props: { workspaceId } }
  }

  // no? then we need to check if the user has authority to create a workspace
  const supabase = createServerSupabaseClient<Database>(context)
  const { data, error } = await supabase.auth.getSession()
  if (error || !data || !data.session) {
    logger.info('getOrCreateWorkspaceSpace: no session')
    return signinRedirect
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
    } else {
      logger.info('getOrCreateWorkspaceSpace: no membership')
    }
    return {
      props: {
        workspaceId: null,
      },
    }
  }
  await createSpace(workspaceId as string)
  logger.info('getOrCreateWorkspaceSpace: created space', { workspaceId })
  return {
    props: {
      workspaceId,
    },
  }
}
