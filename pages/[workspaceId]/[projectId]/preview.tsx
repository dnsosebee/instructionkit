import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { useProjectCtx } from '../../../src/components/loaders/providers/projectProvider'
import { RootHandler } from '../../../src/components/loaders/routeHandlers/rootHandler'
import { Guide } from '../../../src/components/views/app/project/guide/guide'
import { setRoute } from '../../../src/lib/route/route'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  const projectId = params?.projectId as string
  return {
    props: {
      workspaceId,
      projectId,
    },
  }
}

const PreviewPage = ({ workspaceId, projectId }: { workspaceId: string; projectId: string }) => {
  useEffect(() => {
    setRoute({ route: `/${workspaceId}/${projectId}/preview`, action: 'none' })
  }, [])
  return <RootHandler />
}

export default PreviewPage

/**
 *
 */

export const PreviewView = () => {
  const { flows, darts } = useProjectCtx()
  return <Guide flows={flows} darts={darts} />
}
