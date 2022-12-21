import { logger as parentLogger } from '../../../lib/logger'

const logger = parentLogger.child({ component: 'FourOhFour' })

export const FourOhFour = ({ errorMessage }: { errorMessage: string }) => {
  logger.error(errorMessage)
  return <div className='text-white text-2xl'>404: Page not found.</div>
}
