import { WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../../../../lib/logger'
import { Dart } from '../../../../schema/types/dart/dart'
import { Deployment, deploymentSchema } from '../../../../schema/types/deployment'
import { Floem } from '../../../../schema/types/floem'
import { Flow, flowSchema } from '../../../../schema/types/flow/flow'
import { START_FLOW_TYPE } from '../../../../schema/types/flow/types/start'
import {
  applyFlowAndDartChanges,
  FlowAndDartTransaction,
} from '../../../shared/applyFlowAndDartChanges'
import { FloemChangeEvent } from '../../../shared/floemChangeEvent'

import { DARTS_KEY } from './entries/darts'
import { DEPLOYMENT_KEY } from './entries/deploy'
import { flowKey, listFlows } from './entries/flow'

const logger = parentLogger.child({ module: 'projectMutators' })

export type ProjectMutators = typeof projectMutators

export const projectMutators = {
  async reset(
    tx: WriteTransaction,
    { flows, darts, onlyIfEmpty }: { flows: Flow[]; darts: Dart[]; onlyIfEmpty: boolean },
  ) {
    logger.info('reset', { flows, darts })

    if (onlyIfEmpty) {
      const existingFlows = await listFlows(tx)
      if (existingFlows.length > 0) {
        return
      }
    }

    // check that there's one start flow
    const startFlows = flows.filter(flow => flow.type === START_FLOW_TYPE)
    if (startFlows.length !== 1) {
      throw new Error(`reset: expected 1 start flow, got ${startFlows.length}`)
    }

    // check that flowIds are unique
    const flowIds = new Set(flows.map(flow => flow.id))
    if (flowIds.size !== flows.length) {
      throw new Error(`reset: duplicate flow ids`)
    }

    // check that dartIds are unique
    const dartIds = new Set(darts.map(dart => dart.id))
    if (dartIds.size !== darts.length) {
      throw new Error(`reset: duplicate dart ids`)
    }

    // check that all darts are to and from existing flows
    for (const dart of darts) {
      if (!flowIds.has(dart.from)) {
        throw new Error(`reset: dart from non-existent flow ${dart.from}`)
      }
      if (!flowIds.has(dart.to)) {
        throw new Error(`reset: dart to non-existent flow ${dart.to}`)
      }
    }

    // check that there's one dart per source
    const sources = new Set<string>()
    const source = (dart: Dart) => `${dart.from}-${dart.case}`
    for (const dart of darts) {
      if (sources.has(source(dart))) {
        throw new Error(`reset: duplicate dart source ${source(dart)}`)
      }
      sources.add(source(dart))
    }

    const prevFlows = await listFlows(tx)
    for (const flow of prevFlows) {
      await tx.del(flowKey(flow.id))
    }
    for (const flow of flows) {
      await tx.put(flowKey(flow.id), flowSchema.parse(flow))
    }
    await tx.put(DARTS_KEY, darts)
  },
  // flows
  async applyChanges(tx: WriteTransaction, changes: FloemChangeEvent[]) {
    const repTx: FlowAndDartTransaction = {
      getFlow: async (flowId: string) => {
        return (await tx.get(flowKey(flowId))) as Flow
      },
      putFlow: async (flow: Flow) => {
        await tx.put(flowKey(flow.id), flow)
      },
      delFlow: async (flowId: string) => {
        await tx.del(flowKey(flowId))
      },
      getDarts: async () => {
        return (await tx.get(DARTS_KEY)) as Dart[]
      },
      putDarts: async (darts: Dart[]) => {
        await tx.put(DARTS_KEY, darts)
      },
    }
    await applyFlowAndDartChanges(repTx, changes)
  },

  // deploy
  async publish(tx: WriteTransaction, floem: Floem) {
    const prev = (await tx.get(DEPLOYMENT_KEY)) as Deployment | undefined
    const next: Deployment = {
      schemaVersion: floem.schemaVersion,
      createdAt: prev ? prev.createdAt : floem.createdAt,
      versionId: 'TODO!',
      updatedAt: floem.createdAt,
      live: true,
      compiled: {
        flows: floem.flows,
        darts: floem.darts,
      },
    }
    await tx.put(DEPLOYMENT_KEY, deploymentSchema.parse(next))
  },
}
