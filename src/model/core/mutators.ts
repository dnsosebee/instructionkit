import { Replicache, WriteTransaction } from 'replicache'
import { logger as parentLogger } from '../../logger'
import { DartUpdate, DataDart, DEFAULT_DART_CASE, genDartId } from './dart'
import { DataFloem, floemSchema, FloemUpdate } from './floem'
import { DataFlow, DEFAULT_FLOWTEXT, FlowUpdate, genFlowId } from './flow'

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
  async addFlow(tx: WriteTransaction, floemId: string) {
    const prev: DataFloem = (await tx.get(floemId)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floemId}`)
    }
    // make sure the ID is new
    let id = genFlowId()
    while (prev.flows.some(flow => flow.id === id)) {
      id = genFlowId()
    }
    const newFlow: DataFlow = {
      id,
      floem: floemId,
      createdAt: Date.now(),
      position: { x: 0, y: 0 },
      flowtext: DEFAULT_FLOWTEXT,
    }
    const flows = [...prev.flows, newFlow]
    await tx.put(floemId, parseOrSkip(floemSchema, { ...prev, flows }))
  },

  async updateFlow(tx: WriteTransaction, flow: FlowUpdate) {
    const prev: DataFloem = (await tx.get(flow.floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${flow.floem}`)
    }
    const flows = prev.flows.map(f => (f.id === flow.id ? { ...f, ...flow } : f))
    await tx.put(flow.floem, parseOrSkip(floemSchema, { ...prev, flows }))
  },

  // Dart
  async addDart(tx: WriteTransaction, dart: Omit<DataDart, 'id' | 'case'>) {
    const prev: DataFloem = (await tx.get(dart.floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${dart.floem}`)
    }
    let id = genDartId()
    while (prev.darts.some(d => d.id === id)) {
      id = genDartId()
    }
    const newDart: DataDart = { ...dart, id, case: DEFAULT_DART_CASE }
    const darts = [...prev.darts, newDart]
    await tx.put(dart.floem, parseOrSkip(floemSchema, { ...prev, darts }))
  },
  async updateDart(tx: WriteTransaction, dart: DartUpdate) {
    const prev: DataFloem = (await tx.get(dart.floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${dart.floem}`)
    }
    const darts = prev.darts.map(d => (d.id === dart.id ? { ...d, ...dart } : d))
    await tx.put(dart.floem, parseOrSkip(floemSchema, { ...prev, darts }))
  },
}
