import { logger as parentLogger } from '../../logger'

const logger = parentLogger.child({ component: 'redirect' })

export default ({ to, dueToUnallowed = true }: { to: string; dueToUnallowed?: boolean }) => {
  redirectTo(to)
  return null
}

export const redirectTo = (to: string) => {
  logger.info(`Redirecting to ${to}`)
  // alert(`Redirecting to ${to}`)
  window.location.href = to
}
