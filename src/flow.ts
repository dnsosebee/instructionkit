// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { ReadTransaction } from "replicache";

export type Flow = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
};

export type FlowUpdate = Partial<Flow> & Pick<Flow, "id">;

export async function listFlows(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as Flow[];
}
