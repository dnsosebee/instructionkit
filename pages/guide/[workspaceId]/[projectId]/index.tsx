import { createClient } from '@supabase/supabase-js'
import { GetServerSideProps } from 'next'
import { Guide } from '../../../../src/components/views/app/project/guide/guide'
import { DEPLOYMENT_KEY } from '../../../../src/model/persistence/replicache/spaces/proj/entries/deploy'
import { projectSpaceId } from '../../../../src/model/persistence/replicache/spaces/proj/projectRep'
import { Deployment, deploymentSchema } from '../../../../src/model/schema/types/deployment'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  const projectId = params?.projectId as string
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars')
    return {
      notFound: true,
    }
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('entry')
    .select('value')
    .eq('spaceid', projectSpaceId(workspaceId, projectId))
    .eq('key', DEPLOYMENT_KEY)
    .single()

  if (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
  if (!data) {
    console.error('No data')
    return {
      notFound: true,
    }
  }

  const deployment = JSON.parse(data.value)

  try {
    deploymentSchema.parse(deployment)
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }

  return {
    props: {
      deployment,
    },
  }
}

const GuidePage = ({ deployment }: { deployment: Deployment }) => {
  const {
    compiled: { flows, darts },
  } = deployment
  return <Guide flows={flows} darts={darts} />
}

export default GuidePage
