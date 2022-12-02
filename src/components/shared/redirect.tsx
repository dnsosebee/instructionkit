import { logger as parentLogger } from '../../logger'
import UnableToLoad from './unableToLoad'

const logger = parentLogger.child({ component: 'redirect' })

export default ({ to, dueToUnallowed = true }: { to: string; dueToUnallowed?: boolean }) => {
  if (dueToUnallowed) {
    return <UnableToLoad reason={`You are not allowed to access this page. Redirecting to ${to}`} />
  }
  redirectTo(to)
  return null
}

export const redirectTo = (to: string) => {
  logger.info(`Redirecting to ${to}`)
  // alert(`Redirecting to ${to}`)
  window.location.href = to
}
