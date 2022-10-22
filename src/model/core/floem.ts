// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { nanoid } from 'nanoid'
import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { dartSchema, DEFAULT_DART_CASE, genDartId } from './dart'
import { DEFAULT_FLOWTEXT, flowSchema, FLOW_START_ID, genFlowId } from './flow'
import { FLOEM_ID_PREFIX } from './idPrefixes'

export const genFloemId = () => FLOEM_ID_PREFIX + nanoid()

export const floemSchema = z
  .object({
    id: z.string().startsWith(FLOEM_ID_PREFIX).length(27),
    title: z.string(),
    createdAt: z.number(),
    flows: z.array(flowSchema).refine(flows => flows.some(flow => flow.id === FLOW_START_ID)),
    darts: z.array(dartSchema),
  })
  .refine(
    floem =>
      floem.darts.every(dart => floem.flows.some(flow => flow.id === dart.from)) &&
      floem.darts.every(dart => floem.flows.some(flow => flow.id === dart.to)),
  )
  .refine(
    floem =>
      floem.flows.every(flow => flow.floem === floem.id) &&
      floem.darts.every(dart => dart.floem === floem.id),
  )

export type DataFloem = z.infer<typeof floemSchema>

export type FloemUpdate = Partial<DataFloem> & Pick<DataFloem, 'id'>

export async function listFloems(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as DataFloem[]
}

export const STARTER_FLOEM = (id: string = genFloemId()): DataFloem => {
  const flow2Id = genFlowId()
  const dartId = genDartId()
  return {
    id,
    title: 'My New Floem',
    createdAt: Date.now(),
    flows: [
      {
        id: FLOW_START_ID,
        floem: id,
        flowtext: DEFAULT_FLOWTEXT,
        createdAt: Date.now(),
        position: { x: 20, y: 50 },
      },
      {
        id: flow2Id,
        floem: id,
        flowtext: DEFAULT_FLOWTEXT,
        createdAt: Date.now(),
        position: { x: 200, y: 600 },
      },
    ],
    darts: [
      {
        id: dartId,
        floem: id,
        from: FLOW_START_ID,
        to: flow2Id,
        case: DEFAULT_DART_CASE,
      },
    ],
  }
}
