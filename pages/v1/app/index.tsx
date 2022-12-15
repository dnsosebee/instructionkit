import { logger } from '../../../src/logger'
import { App } from '../../../src/routeComponents/route'

export default () => {
  logger.debug('On page app/index.tsx')
  return (
    <App
      route={{
        do: 'loadSession',
        then: {
          do: 'loadAppRep',
        },
      }}
    />
  )
}
