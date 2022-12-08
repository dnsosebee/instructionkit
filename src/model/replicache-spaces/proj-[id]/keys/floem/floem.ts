// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { ReadTransaction } from 'replicache'
import { z } from 'zod'
import { FLOEM_ID_LENGTH, FLOEM_ID_PREFIX, FLOW_START_ID, genFloemId } from '../../projIds'
import { dartSchema } from './dart'
import { DEFAULT_FLOWTEXT, flowSchema } from './flow'

export const floemIdSchema = z.string().startsWith(FLOEM_ID_PREFIX).length(FLOEM_ID_LENGTH)

export const floemSchema = z
  .object({
    id: floemIdSchema,
    title: z.string().optional(), // migration: moving title up to project level
    createdAt: z.number(),
    updatedAt: z.number(),
    flows: z
      .array(flowSchema)
      .refine(
        flows => flows.reduce((acc, flow) => (flow.id === FLOW_START_ID ? acc + 1 : acc), 0) === 1,
        'must have exactly one flow-start',
      ),
    darts: z.array(dartSchema),
  })
  .refine(
    floem =>
      floem.darts.every(dart => floem.flows.some(flow => flow.id === dart.from)) &&
      floem.darts.every(dart => floem.flows.some(flow => flow.id === dart.to)),
    'all darts must have to and from flow ids that exist in the floem',
  ) // TODO add more refinements that parse TipTap output for case IDs

export type DataFloem = z.infer<typeof floemSchema>

export type FloemUpdate = Omit<Partial<DataFloem>, 'createdAt'> &
  Pick<DataFloem, 'id' | 'updatedAt'>

export async function listFloems(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as DataFloem[]
}

export const STARTER_FLOEM = (id: string = genFloemId()): DataFloem => {
  return {
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    flows: [
      {
        id: FLOW_START_ID,
        flowtext: DEFAULT_FLOWTEXT,
        createdAt: Date.now(),
        position: { x: 20, y: 50 },
      },
    ],
    darts: [],
  }
}
