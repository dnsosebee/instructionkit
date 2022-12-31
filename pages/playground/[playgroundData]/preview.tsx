import { GetServerSideProps } from 'next'
import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import { Guide } from '../../../src/components/views/app/project/guide/guide'
import MarketingNav from '../../../src/components/views/marketing/layout/marketingNav'
import { getRoute, setRoute } from '../../../src/lib/route'
import { urlDecodePlayground } from '../../../src/model/url/playground'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const playgroundData = params?.playgroundData as string
  return {
    props: {
      playgroundData,
    },
  }
}

const PlaygroundPreviewPage = ({ playgroundData }: { playgroundData: string }) => {
  setRoute({ route: `/playground/${encodeURIComponent(playgroundData)}/preview`, action: 'none' })
  return <RootHandler />
}

export default PlaygroundPreviewPage

/**
 *
 */

export const PlaygroundPreviewView = () => {
  const { playgroundData } = getRoute().params
  const playground = urlDecodePlayground(playgroundData)
  return (
    <MarketingNav>
      <Guide flows={playground.flows} darts={playground.darts} />
    </MarketingNav>
  )
}
