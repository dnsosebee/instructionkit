import { logger } from '../../../src/logger'
import { LoadSession } from '../../../src/routeComponents/loadSession/loadSession'

export default () => {
  logger.debug('Load page app/index.tsx')
  return (
    <LoadSession
      route={{
        do: 'loadSession',
        then: {
          do: 'loadAppRep',
          then: {
            do: 'accessFallbackWorkspace',
          },
        },
      }}
    />
  )
}
