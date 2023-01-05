import { logger as parentLogger } from '../../../lib/logger'
import { nextId } from '../../schema/id'
import { Dart } from '../../schema/types/dart/dart'
import { Flow, flowSchema } from '../../schema/types/flow/flow'
import { START_FLOW_TYPE } from '../../schema/types/flow/types/start'
import { FloemChangeEvent } from './floemChangeEvent'

const logger = parentLogger.child({ module: 'applyFlowAndDartChanges' })

export type FlowAndDartTransaction = {
  getFlow: (flowId: string) => Promise<Flow | undefined>
  putFlow: (flow: Flow) => Promise<void>
  delFlow: (flowId: string) => Promise<void>
  getDarts: () => Promise<Dart[]>
  putDarts: (darts: Dart[]) => Promise<void>
}

// NOTE: THERE ARE TWO COPIES IN THIS FILE. One is used by playground, one by project. THEY SHOULD BE KEPT IN SYNC.
// The reason I can't share code is that the playground version has to run synchronously, while the project version
// has to run asynchronously. And you can't dynamically assign something as async or not, so I have to duplicate the code.
// It was either that or learn how mutexes work.

export const applyFlowAndDartChanges = async (
  tx: FlowAndDartTransaction,
  changes: FloemChangeEvent[],
) => {
  logger.info(`Applying floem changes: ${JSON.stringify(changes)}`)
  let prev: any
  let darts: Dart[]
  for (const change of changes) {
    switch (change.action) {
      case 'createFlow':
        prev = await tx.getFlow(change.flow.id)
        while (prev !== undefined) {
          logger.info('createFlow: flow already exists', change.flow, prev)
          change.flow = { ...change.flow, id: nextId(change.flow.id) }
          prev = await tx.getFlow(change.flow.id)
        }
        await tx.putFlow(flowSchema.parse(change.flow))
        break

      case 'updateFlow':
        prev = await tx.getFlow(change.update.id)
        if (prev !== undefined) {
          await tx.putFlow(flowSchema.parse({ ...prev, ...change.update }))
        } else {
          throw new Error(`updateFlow: flow not found ${change.update.id}`)
        }
        break

      case 'deleteFlow':
        prev = await tx.getFlow(change.id)
        if (prev !== undefined) {
          if (prev.type !== START_FLOW_TYPE) {
            await tx.delFlow(change.id)
          } else {
            throw new Error(`deleteFlow: cannot delete start flow ${change.id}`)
          }
        } else {
          throw new Error(`deleteFlow: flow not found ${change.id}`)
        }
        break

      case 'createDart':
        darts = (await tx.getDarts()) as Dart[]

        // make sure id is unique
        prev = darts.find(dart => dart.id === change.dart.id)
        while (prev !== undefined) {
          logger.info('createDart: dart already exists, replacing it.', change.dart, prev)
          change.dart = { ...change.dart, id: nextId(change.dart.id) }
          prev = darts.find(dart => dart.id === change.dart.id)
        }

        // make sure source is unique
        prev = darts.findIndex(
          dart => dart.from === change.dart.from && dart.case === change.dart.case,
        )

        if (prev !== -1) {
          darts = [...darts] // we need to make a copy so as not to mutate the original, Replicache disallows this
          darts[prev] = change.dart
          await tx.putDarts(darts)
        } else {
          await tx.putDarts([...darts, change.dart])
        }
        break

      case 'deleteDart':
        darts = (await tx.getDarts()) as Dart[]
        prev = darts.find(dart => dart.id === change.id)
        if (prev !== undefined) {
          darts = darts.filter(dart => dart.id !== change.id)
          await tx.putDarts(darts)
        } else {
          throw new Error(`deleteDart: dart not found ${change.id}`)
        }
        break

      default:
        throw new Error(`unexpected action ${change.action}`)
    }
  }
}

export type SyncFlowAndDartTransaction = {
  getFlow: (flowId: string) => Flow | undefined
  putFlow: (flow: Flow) => void
  delFlow: (flowId: string) => void
  getDarts: () => Dart[]
  putDarts: (darts: Dart[]) => void
}

export const syncApplyFlowAndDartChanges = (
  tx: SyncFlowAndDartTransaction,
  changes: FloemChangeEvent[],
) => {
  logger.info(`Applying floem changes: ${JSON.stringify(changes)}`)
  let prev: any
  let darts: Dart[]
  for (const change of changes) {
    switch (change.action) {
      case 'createFlow':
        prev = tx.getFlow(change.flow.id)
        while (prev !== undefined) {
          logger.info('createFlow: flow already exists', change.flow, prev)
          change.flow = { ...change.flow, id: nextId(change.flow.id) }
          prev = tx.getFlow(change.flow.id)
        }
        tx.putFlow(flowSchema.parse(change.flow))
        break

      case 'updateFlow':
        prev = tx.getFlow(change.update.id)
        if (prev !== undefined) {
          tx.putFlow(flowSchema.parse({ ...prev, ...change.update }))
        } else {
          throw new Error(`updateFlow: flow not found ${change.update.id}`)
        }
        break

      case 'deleteFlow':
        prev = tx.getFlow(change.id)
        if (prev !== undefined) {
          if (prev.type !== START_FLOW_TYPE) {
            tx.delFlow(change.id)
          } else {
            throw new Error(`deleteFlow: cannot delete start flow ${change.id}`)
          }
        } else {
          throw new Error(`deleteFlow: flow not found ${change.id}`)
        }
        break

      case 'createDart':
        darts = tx.getDarts() as Dart[]

        // make sure id is unique
        prev = darts.find(dart => dart.id === change.dart.id)
        while (prev !== undefined) {
          logger.info('createDart: dart already exists, replacing it.', change.dart, prev)
          change.dart = { ...change.dart, id: nextId(change.dart.id) }
          prev = darts.find(dart => dart.id === change.dart.id)
        }

        // make sure source is unique
        prev = darts.findIndex(
          dart => dart.from === change.dart.from && dart.case === change.dart.case,
        )

        if (prev !== -1) {
          darts = [...darts] // we need to make a copy so as not to mutate the original, Replicache disallows this
          darts[prev] = change.dart
          tx.putDarts(darts)
        } else {
          tx.putDarts([...darts, change.dart])
        }
        break

      case 'deleteDart':
        darts = tx.getDarts() as Dart[]
        prev = darts.find(dart => dart.id === change.id)
        if (prev !== undefined) {
          darts = darts.filter(dart => dart.id !== change.id)
          tx.putDarts(darts)
        } else {
          throw new Error(`deleteDart: dart not found ${change.id}`)
        }
        break

      default:
        throw new Error(`unexpected action ${change.action}`)
    }
  }
}
