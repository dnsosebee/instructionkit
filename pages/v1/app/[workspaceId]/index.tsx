import { GetServerSidePropsContext } from 'next'
import { logger } from '../../../../src/logger'
import { LoadSession } from '../../../../src/routeComponents/loadSession/loadSession'

export const getServerSideProps = (context: GetServerSidePropsContext<{ workspaceId: string }>) => {
  const workspaceId = context.query.workspaceId
  return {
    props: {
      workspaceId,
    },
  }
}

export default ({ workspaceId }: { workspaceId: string }) => {
  logger.debug('Load page app/index.tsx')
  return (
    <LoadSession
      route={{
        do: 'loadSession',
        then: {
          do: 'loadAppRep',
          then: {
            do: 'accessWorkspace',
            withInput: workspaceId,
            then: {
              do: 'loadProjects',
            },
          },
        },
      }}
    />
  )
}
