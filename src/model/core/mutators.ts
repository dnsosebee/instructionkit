import { random, sample, times, uniq, without } from "lodash";
import { nanoid } from "nanoid";
import { WriteTransaction } from "replicache";
import { Dart, Floem, FloemUpdate } from "./floem";
import { Flow, FlowUpdate } from "./flow";

export type M = typeof floemMutators;

export const floemMutators = {
  async createFloem(tx: WriteTransaction, floem: Floem) {
    // if (!floem.id.startsWith("floem-")) {
    //   throw new Error("floem id must start with 'floem-'");
    // }
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

  // flows
  async updateFlow(tx: WriteTransaction, flow: FlowUpdate) {
    const old: Floem = (await tx.get(flow.floem)) as Floem;
    if (!old) {
      throw new Error(`No floem with id ${flow.floem}`);
    }
    const flows = old.flows.map((f) =>
      f.id === flow.id ? { ...f, ...flow } : f
    );
    await tx.put(flow.floem, { ...old, flows });
  },

  async addFlow(tx: WriteTransaction, floemId: string) {
    const old: Floem = (await tx.get(floemId)) as Floem;
    if (!old) {
      throw new Error(`No floem with id ${floemId}`);
    }
    const newFlow: Flow = {
      id: nanoid(),
      floem: floemId,
      createdAt: Date.now(),
      position: { x: 0, y: 0 },
      flowtext: uniq(
        times(
          random(1, 5),
          sample.bind(null, [
            "<page-stanza>Yupyupyupyup</page-stanza>",
            "<page-stanza>rootin' tootin' flowtext scootin'!</page-stanza>",
            "<page-stanza>do you think they should make iphones for babies cuz I do!!</page-stanza>",
            "<page-stanza>there is such a thing as a compassionate conspiracy, Daniel.</page-stanza>",
            "<page-stanza>I'm sorry, Daniel. I'm afraid I can't do that.</page-stanza>",
            "<page-stanza>oh christ not this shit again MORE EXAMPLE TEXT???</page-stanza>",
            "<page-stanza>fool me once, shame on shoes.</page-stanza>",
            "<page-stanza>fool me twice, shame on trees.</page-stanza>",
            "<page-stanza>How much ketamine can I have before you will physically pull me off this forklift, officer?</page-stanza>",
            "<code-stanza><pre>help I'm trapped in a code stanza</pre></code-stanza>",
            "<code-stanza><pre>leet(hacker[text]);</pre></code-stanza>",
          ])
        )
      ).join(""),
    };
    const flows = [...old.flows, newFlow];
    await tx.put(floemId, { ...old, flows });
  },

  async removeFlow(
    tx: WriteTransaction,
    { floemId, flowId }: { floemId: string; flowId: string }
  ) {
    const old: Floem = (await tx.get(floemId)) as Floem;
    if (!old) {
      throw new Error(`No floem with id ${floemId}`);
    }
    const flow: Flow | undefined = old.flows.find((v) => v.id == flowId);
    if (!flow) {
      throw new Error(`No flow with id ${flowId}`);
    }
    const flows = without(old.flows, flow);
    const darts = old.darts.filter((v) => v.from != flowId && v.to != flowId);
    await tx.put(floemId, { ...old, flows, darts });
  },

  async removeDart(
    tx: WriteTransaction,
    { floemId, dartId }: { floemId: string; dartId: string }
  ) {
    const old: Floem = (await tx.get(floemId)) as Floem;
    if (!old) {
      throw new Error(`No floem with id ${floemId}`);
    }
    const dart: Dart | undefined = old.darts.find((v) => v.id == dartId);
    if (!dart) {
      throw new Error(`No dart with id ${dartId}`);
    }
    const darts = without(old.darts, dart);
    await tx.put(floemId, { ...old, darts });
  },
};
