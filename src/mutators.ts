import { WriteTransaction } from "replicache";
import { Floem, FloemUpdate } from "./floem";

export type M = typeof floemMutators;

export const floemMutators = {
  async createFloem(tx: WriteTransaction, floem: Floem) {
    await tx.put(floem.id, floem);
  },

  async updateFloem(tx: WriteTransaction, floem: FloemUpdate) {
    const old: Floem = (await tx.get(floem.id)) as Floem;
    if (!old) {
      throw new Error(`No floem with id ${floem.id}`);
    }
    await tx.put(floem.id, { ...old, ...floem });
  },

  async deleteFloem(tx: WriteTransaction, id: string) {
    await tx.del(id);
  },
};
