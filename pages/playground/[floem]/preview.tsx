import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { RootHandler } from '../../../src/components/loaders/routeHandlers/rootHandler'
import { Guide } from '../../../src/components/views/app/project/guide/guide'
import MarketingNav from '../../../src/components/views/marketing/layout/marketingNav'
import { getRoute, setRoute } from '../../../src/lib/route/route'
import { urlDecodeFloem } from '../../../src/model/persistence/url'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const floem = params?.floem as string
  return {
    props: {
      floem,
    },
  }
}

const PlaygroundPreviewPage = ({ floem }: { floem: string }) => {
  useEffect(() => {
    setRoute({ route: `/playground/${encodeURIComponent(floem)}/preview`, action: 'none' })
  }, [])
  return <RootHandler />
}

export default PlaygroundPreviewPage

/**
 *
 */

export const PlaygroundPreviewView = () => {
  const { floem } = getRoute().params
  const decoded = urlDecodeFloem(floem)
  return (
    <MarketingNav>
      <Guide flows={decoded.flows} darts={decoded.darts} />
    </MarketingNav>
  )
}
