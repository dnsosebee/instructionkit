// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { ReadTransaction } from "replicache";

export type Doc = {
  id: string;
  title: string;
  text: string;
  createdAt: number;
};

export type DocUpdate = Partial<Doc> & Pick<Doc, "id">;

export async function listDocs(tx: ReadTransaction) {
  return (await tx.scan().values().toArray()) as Doc[];
}
