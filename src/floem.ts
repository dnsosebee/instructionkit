// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { ReadTransaction } from "replicache";

export type Floem = {
  id: string;
  title: string;
  createdAt: number;
  flows: Flow[];
  darts: Dart[];
};

export type Flow = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export type Dart = {
  from: string;
  to: string;
  case: string | number | boolean;
};

export type FloemUpdate = Partial<Floem> & Pick<Floem, "id">;

export async function listFloems(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as Floem[];
}
