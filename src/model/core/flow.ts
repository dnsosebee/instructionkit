// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { ReadTransaction } from 'replicache'

type Position = {
  x: number
  y: number
}

export type DataFlow = {
  id: string
  floem: string
  flowtext: string
  createdAt: number
  position: Position
}

export type FlowUpdate = Partial<DataFlow> & Pick<DataFlow, 'id'> & Pick<DataFlow, 'floem'>

export async function listFlows(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as DataFlow[]
}
