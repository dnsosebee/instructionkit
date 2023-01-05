import { useEffect } from 'react'
import { RootHandler } from '../../src/components/loaders/routeHandlers/rootHandler'
import { setRoute } from '../../src/lib/route/route'

const PlaygroundPage = () => {
  useEffect(() => {
    setRoute({ route: '/playground', action: 'none' })
  }, [])
  return <RootHandler />
}

export default PlaygroundPage
