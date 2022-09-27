import { nanoid } from "nanoid";
import { Replicache } from "replicache";
import { useSubscribe } from "replicache-react";

import { M } from "./mutators";

import { proxy, useSnapshot } from "valtio";
import { DocSelector } from "./components/docSelector";
import { FlowEditor } from "./components/flowEditor";
import { Doc, DocUpdate, listDocs } from "./doc";

type State = { selectedId: string | null };

const state = proxy<State>({
  selectedId: null,
});

// This is the top-level component for our app.
const App = ({ rep, listID }: { rep: Replicache<M>; listID: string }) => {
  // Subscribe to all todos and sort them.
  const docs = useSubscribe(rep, listDocs, [], [rep]);
  const snap: State = useSnapshot(state);

  // Define event handlers and connect them to Replicache mutators. Each
  // of these mutators runs immediately (optimistically) locally, then runs
  // again on the server-side automatically.
  const handleNewItem = ({ text, title }: { text: string; title: string }) => {
    const id = nanoid();
    rep.mutate.createDoc({
      id,
      text,
      title,
      createdAt: Date.now(),
    });
    state.selectedId = id;
  };

  const handleUpdateDoc = (update: DocUpdate) => rep.mutate.updateDoc(update);

  const handleDeleteDoc = (ids: string[]) => {
    for (const id of ids) {
      rep.mutate.deleteDoc(id);
    }
  };

  if (snap.selectedId) {
    const doc = docs.find((doc) => doc.id === snap.selectedId);
    if (doc) {
      return (
        <div className="flex">
          <Sidebar
            docs={docs}
            handleDeleteDoc={handleDeleteDoc}
            handleNewItem={handleNewItem}
          />
          <FlowEditor doc={doc} handleUpdateDoc={handleUpdateDoc} />
        </div>
      );
    }
  }

  return (
    <div className="flex">
      <Sidebar
        docs={docs}
        handleDeleteDoc={handleDeleteDoc}
        handleNewItem={handleNewItem}
      />
      <h1 className="text-4xl m-10">⬅️ Select a document to begin</h1>
    </div>
  );
};

const Sidebar = ({
  docs,
  handleNewItem,
  handleDeleteDoc,
}: {
  docs: Doc[];
  handleNewItem: any;
  handleDeleteDoc: any;
}) => {
  console.log(state.selectedId);
  console.log(docs);
  return (
    <div className="bg-blue-100 h-screen w-64">
      <div className="flex flex-col">
        <p className="text-2xl text-center my-2">My Documents</p>
        {docs.map((doc) => (
          <DocSelector
            selected={state.selectedId === doc.id}
            key={`DS/${doc.id}`}
            doc={doc}
            onSelect={() => {
              state.selectedId = doc.id;
            }}
            onDelete={() => {
              handleDeleteDoc([doc.id]);
            }}
          />
        ))}
      </div>
      <button
        className="rounded shadow-lg bg-green-100 hover:bg-green-200 text-gray-800 py-2 px-4 m-2"
        onClick={() =>
          handleNewItem({
            title: "<p>untitled</p>",
            text: "<ContentNode>CN 1</ContentNode><ContentNode>CN 2</ContentNode>",
          })
        }
      >
        ➕ New Doc ➕
      </button>
    </div>
  );
};

export default App;
