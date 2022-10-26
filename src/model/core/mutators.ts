import {} from 'nanoid'
import { Replicache, WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../logger'
import { DartUpdate, DataDart } from './dart'
import { DataFloem, floemSchema, FloemUpdate } from './floem'
import { DataFlow, DEFAULT_FLOWTEXT, FlowUpdate } from './flow'
import { DART_UUID_LENGTH, FLOW_UUID_LENGTH, nextId } from './ids'

const logger = parentLogger.child({ module: 'mutators' })

export type M = typeof floemMutators
export type Rep = Replicache<M>
export type Mutate = Rep['mutate'] & { spaceRelativeUrl: (path: string) => string }

const parseOrSkip = <T>(schema: any, data: any, parse = true): T => {
  logger.info(parse ? 'parsing data: ' : 'skipped parsing data: ', data)
  return parse ? schema.parse(data) : data
}

export const floemMutators = {
  // Floem
  async createFloem(tx: WriteTransaction, floem: DataFloem) {
    await tx.put(floem.id, parseOrSkip(floemSchema, floem))
  },

  async updateFloem(tx: WriteTransaction, floem: FloemUpdate) {
    const prev: DataFloem = (await tx.get(floem.id)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floem.id}`)
    }
    const next = { ...prev, ...floem }
    await tx.put(floem.id, parseOrSkip(floemSchema, next))
  },

  async deleteFloem(tx: WriteTransaction, id: string) {
    await tx.del(id)
  },

  // Flow
  async addFlow(tx: WriteTransaction, ids: { flowId: string; floemId: string }) {
    const { flowId, floemId } = ids
    const prev: DataFloem = (await tx.get(floemId)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floemId}`)
    }
    // make sure the ID is new
    let id = flowId
    while (prev.flows.some(flow => flow.id === id)) {
      id = nextId(id, FLOW_UUID_LENGTH)
    }
    const newFlow: DataFlow = {
      id,
      createdAt: Date.now(),
      position: { x: 0, y: 0 },
      flowtext: DEFAULT_FLOWTEXT,
    }
    const flows = [...prev.flows, newFlow]
    await tx.put(floemId, parseOrSkip(floemSchema, { ...prev, flows }))
  },

  async updateFlow(tx: WriteTransaction, flowUpdate: FlowUpdate) {
    const prev: DataFloem = (await tx.get(flowUpdate.floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${flowUpdate.floem}`)
    }
    const flows = prev.flows.map(f => (f.id === flowUpdate.id ? { ...f, ...flowUpdate } : f))
    await tx.put(prev.id, parseOrSkip(floemSchema, { ...prev, flows }))
  },

  // Dart
  async addDart(tx: WriteTransaction, data: { dart: DataDart; floem: string }) {
    const { dart, floem } = data
    const prev: DataFloem = (await tx.get(floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floem}`)
    }
    let id = dart.id
    while (prev.darts.some(d => d.id === id)) {
      id = nextId(id, DART_UUID_LENGTH)
    }
    const darts = [...prev.darts, { ...dart, id }]
    await tx.put(floem, parseOrSkip(floemSchema, { ...prev, darts }))
  },
  async updateDart(tx: WriteTransaction, dartUpdate: DartUpdate) {
    const prev: DataFloem = (await tx.get(dartUpdate.floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${dartUpdate.floem}`)
    }
    const darts = prev.darts.map(d => (d.id === dartUpdate.id ? { ...d, ...dartUpdate } : d))
    await tx.put(dartUpdate.floem, parseOrSkip(floemSchema, { ...prev, darts }))
  },
}
