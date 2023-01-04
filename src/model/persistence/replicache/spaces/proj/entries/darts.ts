import { ReadTransaction } from 'replicache'
import { Dart } from '../../../../../schema/types/dart/dart'

export const DARTS_KEY = 'darts'
export const listDarts = async (tx: ReadTransaction): Promise<Dart[]> => {
  return ((await tx.get(DARTS_KEY)) || []) as Dart[]
}
