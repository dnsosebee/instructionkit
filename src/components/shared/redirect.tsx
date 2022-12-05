import { logger as parentLogger } from '../../logger'
import Loading from './loading'

const logger = parentLogger.child({ component: 'redirect' })

// butOnlyIf
export default ({ to, butOnlyIf = true }: { to: string; butOnlyIf?: boolean }) => {
  if (!butOnlyIf) {
    return <Loading />
  }
  redirectTo(to)
  return null
}

export const redirectTo = (to: string) => {
  logger.info(`Redirecting to ${to}`)
  // alert(`Redirecting to ${to}`)
  window.location.href = to
}
