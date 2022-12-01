import { logger as parentLogger } from '../../logger'
import UnableToLoad from './unableToLoad'

const logger = parentLogger.child({ component: 'redirect' })

export default ({ to }: { to: string }) => {
  // redirectTo(to)
  // return null
  return <UnableToLoad reason={`Redirecting to ${to}`} />
}

export const redirectTo = (to: string) => {
  logger.info(`Redirecting to ${to}`)
  alert(`Redirecting to ${to}`)
  window.location.href = to
}
