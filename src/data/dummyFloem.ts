import { nanoid } from "nanoid";
import { Floem } from "../floem";
import { starterContent } from "./content";

export const genDummyFloem = (): Floem => {
  const id = nanoid();
  return {
    id,
    title: "Floem",
    createdAt: Date.now(),
    flows: [
      {
        id: "flow1",
        floem: id,
        flowtext: starterContent,
        createdAt: Date.now(),
        position: { x: 0, y: 0 },
      },
      {
        id: "flow2",
        floem: id,
        flowtext: "Flow 2",
        createdAt: Date.now(),
        position: { x: 100, y: 0 },
      },
    ],
    darts: [
      {
        id: "dart1",
        from: "flow1",
        to: "flow2",
        case: "hello",
      },
    ],
  };
};
