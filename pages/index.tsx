import { useEffect } from 'react'
import { RootHandler, ROOT_HREF } from '../src/components/loaders/routeHandlers/rootHandler'
import { setRoute } from '../src/lib/route/route'

const AppPage = () => {
  useEffect(() => {
    setRoute({ route: ROOT_HREF, action: 'none', reason: 'AppPage' })
  }, [])
  return <RootHandler />
}

export default AppPage
