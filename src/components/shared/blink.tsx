import Link from 'next/link'
import React from 'react'

export const Blink = ({
  url,
  callback,
  children,
}: {
  url: string
  callback?: () => void
  children: React.ReactNode
}) => {
  if (callback) {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      callback()
    }
    return (
      <a href={url} onClick={handleClick}>
        {children}
      </a>
    )
  }
  return <Link href={url}>{children}</Link>
}
