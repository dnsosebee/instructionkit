import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'
import { createSpace, spaceExists } from 'replicache-nextjs/lib/backend'
import { Database } from '../lib/database.types'
import { genMembershipDBKey } from '../model/replicache-spaces/app/types/membership'

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
export const getOrCreateWorkspace: GetServerSideProps<WorkspaceIdIfExists> = async context => {
  const { workspaceId } = context.query as { workspaceId: string }

  if (await spaceExists(workspaceId)) {
    return { props: { workspaceId } }
  }

  // no? then we need to check if the user has authority to create a workspace
  const supabase = createServerSupabaseClient<Database>(context)
  const { data, error } = await supabase.auth.getSession()
  if (error || !data || !data.session) {
    return signinRedirect
  }

  const userId = data.session.user.id
  const membershipDBKey = genMembershipDBKey(workspaceId as string, userId)

  const { data: membershipData, error: membershipError } = await supabase
    .from('entry')
    .select('value')
    .eq('key', membershipDBKey)
    .single()

  if (membershipError || !membershipData) {
    return {
      props: {
        workspaceId: null,
      },
    }
  }

  await createSpace(workspaceId as string)
  return {
    props: {
      workspaceId,
    },
  }
}
