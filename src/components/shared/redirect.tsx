import { logger as parentLogger } from '../../logger'
import Loading from './loading'

const logger = parentLogger.child({ component: 'redirect' })

// if doneSyncing is not defined, assume we don't care to sync before triggering a redirect.
export default ({ to, doneSyncing = true }: { to: string; doneSyncing?: boolean }) => {
  if (!doneSyncing) {
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
