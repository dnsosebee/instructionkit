import { GetServerSideProps } from 'next'
import React from 'react'
import FlowchartProvider, {
  FloemChangeEvent,
  FlowchartProviderProps,
} from '../../../src/components/loaders/providers/flowchartProvider'
import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import { Flowchart } from '../../../src/components/views/app/project/flowchart/flowchart'
import { logger as parentLogger } from '../../../src/lib/logger'
import { getRoute, setRoute } from '../../../src/lib/route'
import { START_FLOW_TYPE } from '../../../src/model/replicache/spaces/proj/entries/flow/types/start'
import {
  Playground,
  urlDecodePlayground,
  urlEncodePlayground,
} from '../../../src/model/url/playground'

const logger = parentLogger.child({ component: 'playground' })

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const playgroundData = params?.playgroundData as string
  return {
    props: {
      playgroundData,
    },
  }
}

const PlaygroundPage = ({ playgroundData }: { playgroundData: string }) => {
  setRoute({ route: `/playground/${encodeURIComponent(playgroundData)}`, action: 'none' })
  return <RootHandler />
}

export default PlaygroundPage

/**
 *
 */

export const PlaygroundView = () => {
  const { playgroundData } = getRoute().params

  const newRef = (data: string) => {
    return urlDecodePlayground(data)
  }
  const ref = React.useRef(newRef(playgroundData))
  React.useEffect(() => {
    ref.current = newRef(playgroundData)
    logger.debug('ref', ref.current)
  }, [playgroundData])

  const updatePlayground = (updatedPlayground: Playground) => {
    setRoute({ route: `/playground/${urlEncodePlayground(updatedPlayground)}`, action: 'push' })
  }

  const flowchartProviderProps: Omit<FlowchartProviderProps, 'children'> = {
    title: ref.current.title,
    flows: ref.current.flows,
    darts: ref.current.darts,
    previewHref: `/playground/${playgroundData}/preview`,
    send: function (changes: FloemChangeEvent | FloemChangeEvent[]): void {
      logger.debug('send', changes)
      if (!Array.isArray(changes)) {
        changes = [changes]
      }
      const updatedPlayground = { ...ref.current }
      for (const change of changes) {
        let existing: any
        switch (change.action) {
          case 'createFlow':
            existing = updatedPlayground.flows.find(flow => flow.id === change.flow.id)
            if (existing === undefined) {
              updatedPlayground.flows.push(change.flow)
            } else {
              logger.warn('createFlow: flow already exists', change.flow)
            }
            break
          case 'updateFlow':
            existing = updatedPlayground.flows.find(flow => flow.id === change.update.id)
            if (existing !== undefined) {
              Object.assign(existing, change.update)
            } else {
              logger.warn('updateFlow: flow not found', change.update)
            }
            break
          case 'deleteFlow':
            existing = updatedPlayground.flows.find(flow => flow.id === change.id)
            if (existing !== undefined) {
              if (existing.type !== START_FLOW_TYPE) {
                updatedPlayground.flows.splice(updatedPlayground.flows.indexOf(existing), 1)
              } else {
                logger.warn('deleteFlow: cannot delete start flow', change.id)
                return
              }
            } else {
              logger.warn('deleteFlow: flow not found', change.id)
            }
            break
          case 'createDart':
            existing = updatedPlayground.darts.find(dart => dart.id === change.dart.id)
            if (existing === undefined) {
              updatedPlayground.darts.push(change.dart)
            } else {
              logger.warn('createDart: dart already exists', change.dart)
            }
            break
          case 'deleteDart':
            existing = updatedPlayground.darts.find(dart => dart.id === change.id)
            if (existing !== undefined) {
              updatedPlayground.darts.splice(updatedPlayground.darts.indexOf(existing), 1)
            } else {
              logger.warn('deleteDart: dart not found', change.id)
            }
            break
          case 'updateTitle':
            updatedPlayground.title = change.title
            break
          default:
            logger.warn('unknown action', change)
        }
      }
      updatePlayground(updatedPlayground)
    },
  }
  return (
    <FlowchartProvider {...flowchartProviderProps}>
      <Flowchart />
    </FlowchartProvider>
  )
}
