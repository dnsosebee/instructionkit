import { nanoid } from "nanoid";
import { Replicache } from "replicache";
import { useSubscribe } from "replicache-react";

import { M } from "./mutators";

import { proxy, useSnapshot } from "valtio";
import { DocSelector } from "./components/docSelector";
import { FlowEditor } from "./components/flowEditor";
import { Flow, FlowUpdate, listFlows } from "./flow";
import { listFloems, Floem } from "./floem";
import { Flowpad } from "./components/floemEditor";

type State = { selectedId: string | null };

const state = proxy<State>({
  selectedId: null,
});

// This is the top-level component for our app.
const App = ({ rep, listID }: { rep: Replicache<M>; listID: string }) => {
  const floem: Floem = {
    id: listID,
    title: "Floem",
    createdAt: Date.now(),
    flows: [{
      id: "flow1",
      text: "Flow 1",
      x: 10,
      y: 10,
    }, {
      id: "flow2",
      text: "Flow 2",
      x: 10,
      y: 100,
    }],
    darts: [{
      from: "flow1",
      to: "flow2",
      case: "hello",
    }],
  };
  return <Flowpad floem={floem}></Flowpad>;
};

export default App;
