import { setRoute } from '../../lib/route/route'

/**
 * A Blink is an anchor tag that will change the route without reloading the page. Portmanteau of "button" and "link". :)
 */
export const Blink = ({
  href,
  children,
  ...props
}: {
  href: string
  children: React.ReactNode
} & Omit<React.HTMLProps<HTMLAnchorElement>, 'href' | 'onClick'>) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setRoute({ route: href, action: 'push' })
  }
  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
