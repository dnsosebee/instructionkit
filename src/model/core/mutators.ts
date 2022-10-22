import { nanoid } from 'nanoid'
import { Replicache, WriteTransaction } from 'replicache'
import { STARTER_CONTENT } from './data/content'
import { DataDartUpdate as DartUpdate, DataFloem, FloemUpdate } from './floem'
import { DataFlow, FlowUpdate } from './flow'

export type M = typeof floemMutators
export type Rep = Replicache<M>
export type Mutate = Rep['mutate'] & { spaceRelativeUrl: (path: string) => string }

export const floemMutators = {
  async createFloem(tx: WriteTransaction, floem: DataFloem) {
    await tx.put(floem.id, floem)
  },

  async updateFloem(tx: WriteTransaction, floem: FloemUpdate) {
    const old: DataFloem = (await tx.get(floem.id)) as DataFloem
    if (!old) {
      throw new Error(`No floem with id ${floem.id}`)
    }
    if (floem.flows && floem.flows.every(flow => flow.id !== 'flow-start')) {
      return
    }
    await tx.put(floem.id, { ...old, ...floem })
  },

  async deleteFloem(tx: WriteTransaction, id: string) {
    await tx.del(id)
  },

  // flows
  async updateFlow(tx: WriteTransaction, flow: FlowUpdate) {
    const old: DataFloem = (await tx.get(flow.floem)) as DataFloem
    if (!old) {
      throw new Error(`No floem with id ${flow.floem}`)
    }
    const flows = old.flows.map(f => (f.id === flow.id ? { ...f, ...flow } : f))
    await tx.put(flow.floem, { ...old, flows })
  },

  async addFlow(tx: WriteTransaction, floemId: string) {
    const old: DataFloem = (await tx.get(floemId)) as DataFloem
    if (!old) {
      throw new Error(`No floem with id ${floemId}`)
    }
    const newFlow: DataFlow = {
      id: nanoid(),
      floem: floemId,
      createdAt: Date.now(),
      position: { x: 0, y: 0 },
      flowtext: STARTER_CONTENT,
    }
    const flows = [...old.flows, newFlow]
    await tx.put(floemId, { ...old, flows })
  },

  async updateDart(tx: WriteTransaction, dart: DartUpdate) {
    const old: DataFloem = (await tx.get(dart.floem)) as DataFloem
    if (!old) {
      throw new Error(`No floem with id ${dart.floem}`)
    }
    const darts = old.darts.map(d => (d.id === dart.id ? { ...d, ...dart } : d))
    await tx.put(dart.floem, { ...old, darts })
  },
}
