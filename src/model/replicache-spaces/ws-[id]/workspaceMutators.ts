import { customAlphabet } from 'nanoid'
import { Replicache, WriteTransaction } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { logger as parentLogger } from '../../../logger'
import { WORKSPACE_ID_PREFIX } from '../app/types/workspace'
import { DartUpdate, DataDart } from './dart'
import { DataFloem, floemSchema, FloemUpdate } from './floem'
import { DataFlow, DEFAULT_FLOWTEXT, FlowUpdate } from './flow'
import { ALPHABET, DART_UUID_LENGTH, FLOW_UUID_LENGTH, nextId } from './ids'

const logger = parentLogger.child({ module: 'mutators' })

export const SPACE_WORKSPACE_ID_PREFIX = WORKSPACE_ID_PREFIX
export const WORKSPACE_UUID_LENGTH = 10
export const genWorkspaceUuid = customAlphabet(ALPHABET, WORKSPACE_UUID_LENGTH)
export const genWorkspaceId = () => SPACE_WORKSPACE_ID_PREFIX + genWorkspaceUuid()

export type WorkspaceMutators = typeof workspaceMutators
export type WorkspaceRep = Replicache<WorkspaceMutators>
export type WorkspaceMutate = WorkspaceRep['mutate'] & {
  spaceRelativeUrl: (path: string) => string
}

const parseOrSkip = <T>(schema: any, data: any, parse = true): T => {
  logger.info(parse ? 'parsing data: ' : 'skipped parsing data: ', data)
  return parse ? schema.parse(data) : data
}

export const workspaceMutators = {
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
  async addFlow(
    tx: WriteTransaction,
    data: { flow: Omit<DataFlow, 'createdAt'>; floemId: string },
  ) {
    const { flow, floemId } = data
    const prev: DataFloem = (await tx.get(floemId)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floemId}`)
    }
    // make sure the ID is new
    let id = flow.id
    while (prev.flows.some(flow => flow.id === id)) {
      id = nextId(id, FLOW_UUID_LENGTH)
    }
    const newFlow: DataFlow = {
      id,
      createdAt: Date.now(),
      position: flow.position ?? { x: 0, y: 0 },
      flowtext: flow.flowtext ?? DEFAULT_FLOWTEXT,
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
    const darts = [
      ...prev.darts.filter(v => v.from != dart.from || v.case != dart.case),
      { ...dart, id },
    ]
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

export const useWorkspaceRep = (id: string) => {
  return useReplicache<WorkspaceMutators>({ name: id, mutators: workspaceMutators })
}
