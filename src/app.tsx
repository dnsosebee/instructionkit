import { nanoid } from "nanoid";
import { Replicache } from "replicache";
import { useSubscribe } from "replicache-react";

import { proxy, useSnapshot } from "valtio";
import { Flowcard } from "./components/Flowcard";
import { Flowpad } from "./components/flowpad";
import { dummyFloem } from "./data/floem";
import { Floem, listFloems } from "./floem";
import { FlowUpdate } from "./flow";
import { M } from "./mutators";

type State = { selectedId: string | null };

const state = proxy<State>({
  selectedId: null,
});

// This is the top-level component for our app.
const App = ({ rep, listID }: { rep: Replicache<M>; listID: string }) => {
  // Subscribe to all floems.
  const floems = useSubscribe(rep, listFloems, [], [rep]);
  const snap: State = useSnapshot(state);

  // Define event handlers and connect them to Replicache mutators. Each
  // of these mutators runs immediately (optimistically) locally, then runs
  // again on the server-side automatically.
  const handleNewItem = (floem: Omit<Floem, "id">) => {
    const id = nanoid();
    rep.mutate.createFloem({ id, ...floem });
    state.selectedId = id;
  };

  const handleUpdateFloem = (update: FlowUpdate) =>
    rep.mutate.updateFloem(update);

  const handleUpdateTitle = (id: string, title: string) =>
    rep.mutate.updateFloem({ id, title });

  const handleDeleteFloem = (ids: string[]) => {
    for (const id of ids) {
      rep.mutate.deleteFloem(id);
    }
  };

  if (snap.selectedId) {
    const floem = floems.find((floem) => floem.id === snap.selectedId);
    if (floem) {
      return (
        <div className="flex grow">
          <Sidebar
            floems={floems}
            handleDeleteFloem={handleDeleteFloem}
            handleNewItem={handleNewItem}
            handleUpdateTitle={handleUpdateTitle}
          />
          <Flowpad floem={floem} key={`RF/${floem.id}`} />
        </div>
      );
    }
  }

  return (
    <div className="flex">
      <Sidebar
        floems={floems}
        handleDeleteFloem={handleDeleteFloem}
        handleNewItem={handleNewItem}
        handleUpdateTitle={handleUpdateTitle}
      />
      <h1 className="text-4xl m-10">⬅️ Select a floem to begin</h1>
    </div>
  );
};

const Sidebar = ({
  floems,
  handleNewItem,
  handleDeleteFloem,
  handleUpdateTitle,
}: {
  floems: Floem[];
  handleNewItem: any;
  handleDeleteFloem: any;
  handleUpdateTitle: (id: string, title: string) => void;
}) => {
  return (
    <div className="bg-blue-100 h-screen w-64">
      <div className="flex flex-col">
        <p className="text-2xl text-center my-2">My Documents</p>
        {floems.map((floem) => (
          <Flowcard
            handleUpdateTitle={handleUpdateTitle}
            selected={state.selectedId === floem.id}
            key={`FloemSelector/${floem.id}`}
            floem={floem}
            onSelect={() => {
              state.selectedId = floem.id;
            }}
            onDelete={() => {
              handleDeleteFloem([floem.id]);
            }}
          />
        ))}
      </div>
      <button
        className="rounded shadow-lg bg-green-100 hover:bg-green-200 text-gray-800 py-2 px-4 m-2"
        onClick={() => handleNewItem(dummyFloem)}
      >
        ➕ New Floem ➕
      </button>
    </div>
  );
};

export default App;

export {};
