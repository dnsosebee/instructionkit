import { logger as parentLogger } from '../../lib/logger'
import { setRoute } from '../../lib/route/route'

const logger = parentLogger.child({ component: 'blink' })

/**
 * A Blink is an anchor tag that will change the route without reloading the page. Portmanteau of "button" and "link". :)
 */
export const Blink = ({
  href,
  children,
  reason,
  ...props
}: {
  href: string
  reason?: string
  children: React.ReactNode
} & Omit<React.HTMLProps<HTMLAnchorElement>, 'href' | 'onClick'>) => {
  const handleClick = (e: React.MouseEvent) => {
    logger.debug('Blink', { href, reason })
    e.preventDefault()
    setRoute({ route: href, action: 'push', reason })
  }
  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
