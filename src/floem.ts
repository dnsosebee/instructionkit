// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { ReadTransaction } from "replicache";
import { WriteTransaction } from "replicache";

export type Floem = {
  id: string;
  title: string;
  createdAt: number;
  flows: Flow[];
  darts: Dart[];
};

export type Flow = {
  id: string,
  text: string,
  x: number,
  y: number,
}

export type Dart = {
  from: string,
  to: string,
  case: string | number | boolean,
}

export type FloemUpdate = Partial<Floem> & Pick<Floem, "id">;

export async function listFloems(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as Floem[];
}

export type M = typeof floemMutators;

export const floemMutators = {
  async createFloem(tx: WriteTransaction, floem: Floem) {
    await tx.put(floem.id, floem);
  },

  async updateFloem(tx: WriteTransaction, floem: FloemUpdate) {
    const old: Floem = await tx.get(floem.id) as Floem;
    if (!old) {
      throw new Error(`No floem with id ${floem.id}`);
    }
    await tx.put(floem.id, { ...old, ...floem });
  },

  async deleteFloem(tx: WriteTransaction, id: string) {
    await tx.del(id);
  }

};
