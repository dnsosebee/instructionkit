import { Floem } from "../floem";

export const dummyFloem: Floem = {
  id: "dummy-floem",
  title: "Floem",
  createdAt: Date.now(),
  flows: [
    {
      id: "flow1",
      text: "Flow 1",
      x: 10,
      y: 10,
    },
    {
      id: "flow2",
      text: "Flow 2",
      x: 10,
      y: 100,
    },
  ],
  darts: [
    {
      from: "flow1",
      to: "flow2",
      case: "hello",
    },
  ],
};
