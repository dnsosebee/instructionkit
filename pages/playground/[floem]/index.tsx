import { GetServerSideProps } from 'next'
import { useEffect, useReducer } from 'react'
import FlowchartProvider, {
  FlowchartProviderProps,
} from '../../../src/components/loaders/providers/flowchartProvider'
import { RootHandler } from '../../../src/components/loaders/routeHandlers/rootHandler'
import { Flowchart } from '../../../src/components/views/app/project/flowchart/flowchart'
import { logger as parentLogger } from '../../../src/lib/logger'
import { getRoute, setRoute } from '../../../src/lib/route/route'
import {
  syncApplyFlowAndDartChanges,
  SyncFlowAndDartTransaction,
} from '../../../src/model/persistence/shared/applyFlowAndDartChanges'
import { FloemChangeEvent } from '../../../src/model/persistence/shared/floemChangeEvent'

import { urlDecodeFloem, urlEncodeFloem } from '../../../src/model/persistence/url'
import { Floem } from '../../../src/model/schema/types/floem'

const logger = parentLogger.child({ component: 'playground' })

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const floem = params?.floem as string
  return {
    props: {
      floem,
    },
  }
}

const PlaygroundPage = ({ floem }: { floem: string }) => {
  useEffect(() => {
    setRoute({ route: `/playground/${encodeURIComponent(floem)}`, action: 'none' })
  }, [])
  return <RootHandler />
}

export default PlaygroundPage

/**
 *
 */

export const PlaygroundView = () => {
  const { floem } = getRoute().params // idk maybe switch to authoritative reducer in the middle

  const decoded = urlDecodeFloem(floem)

  const [state, dispatch] = useReducer((state: Floem, action: FloemChangeEvent[]) => {
    const update = JSON.parse(JSON.stringify(state)) as Floem
    const urlTx: SyncFlowAndDartTransaction = {
      getFlow: flowId => {
        return update.flows.find(flow => flow.id === flowId)
      },
      putFlow: flow => {
        const existing = update.flows.find(f => f.id === flow.id)
        if (existing !== undefined) {
          Object.assign(existing, flow)
        } else {
          update.flows.push(flow)
        }
      },
      delFlow: flowId => {
        const index = update.flows.findIndex(flow => flow.id === flowId)
        if (index !== -1) {
          update.flows.splice(index, 1)
        }
      },
      getDarts: () => {
        return update.darts
      },
      putDarts: darts => {
        update.darts = darts
      },
    }
    syncApplyFlowAndDartChanges(urlTx, action)
    window.history.pushState({}, '', `/playground/${urlEncodeFloem(update)}`)
    return update
  }, decoded)

  const flowchartProviderProps: Omit<FlowchartProviderProps, 'children'> = {
    title: state.title,
    flows: state.flows,
    darts: state.darts,
    previewHref: `/playground/${urlEncodeFloem(state)}/preview`,
    send: function (changes: FloemChangeEvent | FloemChangeEvent[]): void {
      if (!Array.isArray(changes)) {
        changes = [changes]
      }
      if (changes.length > 0) {
        dispatch(changes)
      }
      // const update = {
      //   ...ref.current,
      // }
      // for (const change of changes) {
      //   let existing: any
      //   switch (change.action) {
      //     case 'createFlow':
      //       existing = update.flows.find(flow => flow.id === change.flow.id)
      //       if (existing === undefined) {
      //         update.flows.push(change.flow)
      //       } else {
      //         logger.warn('createFlow: flow already exists', change.flow)
      //         return
      //       }
      //       break
      //     case 'updateFlow':
      //       existing = update.flows.find(flow => flow.id === change.update.id)
      //       if (existing !== undefined) {
      //         Object.assign(existing, change.update)
      //       } else {
      //         logger.warn('updateFlow: flow not found', change.update)
      //         return
      //       }
      //       break
      //     case 'deleteFlow':
      //       existing = update.flows.find(flow => flow.id === change.id)
      //       if (existing !== undefined) {
      //         if (existing.type !== START_FLOW_TYPE) {
      //           update.flows.splice(update.flows.indexOf(existing), 1)
      //         } else {
      //           logger.warn('deleteFlow: cannot delete start flow', change.id)
      //           return
      //         }
      //       } else {
      //         logger.warn('deleteFlow: flow not found', change.id)
      //         return
      //       }
      //       break
      //     case 'createDart':
      //       existing = update.darts.find(dart => dart.id === change.dart.id)
      //       if (existing === undefined) {
      //         if (
      //           update.darts.some(
      //             dart => dart.from === change.dart.from && dart.case === change.dart.case,
      //           )
      //         ) {
      //           logger.warn('createDart: dart already exists', change.dart)
      //           return
      //         } else {
      //           update.darts.push(change.dart)
      //         }
      //       } else {
      //         logger.warn('createDart: dart already exists', change.dart)
      //         return
      //       }
      //       break
      //     case 'deleteDart':
      //       existing = update.darts.find(dart => dart.id === change.id)
      //       if (existing !== undefined) {
      //         update.darts.splice(update.darts.indexOf(existing), 1)
      //       } else {
      //         logger.warn('deleteDart: dart not found', change.id)
      //         return
      //       }
      //       break
      //     case 'updateTitle':
      //       update.title = change.title
      //       break
      //     default:
      //       logger.warn('unknown action', change)
      //   }
      // }
      // updateFloem(update)
    },
  }
  return (
    <FlowchartProvider {...flowchartProviderProps}>
      <Flowchart />
    </FlowchartProvider>
  )
}
