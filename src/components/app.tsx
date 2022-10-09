import { Replicache } from 'replicache'
import { useSubscribe } from 'replicache-react'

import { proxy, useSnapshot } from 'valtio'
import { genDummyFloem } from '../model/core/data/dummyFloem'
import { DataFloem, listFloems } from '../model/core/floem'
import { M } from '../model/core/mutators'
import { Flowcard } from './Flowcard'
import { Chart } from './chart/chart'
import { useState } from 'react'
import { River } from './river/river'

type State = { selectedId: string | null }

const state = proxy<State>({
  selectedId: null,
})

export type Rep = Replicache<M>
export type Mutate = Rep['mutate']

// This is the top-level component for our app.
const App = ({ rep }: { rep: Rep }) => {
  const [flowing, setFlowing] = useState(false)

  const startFlowing = () => setFlowing(true)
  const stopFlowing = () => setFlowing(false)

  // Subscribe to all floems.
  const floems = useSubscribe(rep, listFloems, [], [rep])
  const snap: State = useSnapshot(state)

  // Define event handlers and connect them to Replicache mutators. Each
  // of these mutators runs immediately (optimistically) locally, then runs
  // again on the server-side automatically.
  const handleNewItem = (floem: DataFloem) => {
    rep.mutate.createFloem(floem)
    state.selectedId = floem.id
  }

  const handleUpdateTitle = (id: string, title: string) => rep.mutate.updateFloem({ id, title })

  const handleDeleteFloem = (ids: string[]) => {
    for (const id of ids) {
      rep.mutate.deleteFloem(id)
    }
  }

  let floem = null

  if (snap.selectedId) {
    floem = floems.find(floem => floem.id === snap.selectedId)
  }

  return flowing ? (
    <River mutate={rep.mutate} floem={floem} stopFlowing={stopFlowing} />
  ) : (
    <div className='flex'>
      <Sidebar
        floems={floems}
        handleDeleteFloem={handleDeleteFloem}
        handleNewItem={handleNewItem}
        handleUpdateTitle={handleUpdateTitle}
      />
      {floem ? (
        <Chart
          mutate={rep.mutate}
          floem={floem}
          startFlowing={startFlowing}
          key={`RF/${floem.id}`}
        />
      ) : (
        <h1 className='text-4xl m-10'>⬅️ Select a floem to begin</h1>
      )}
    </div>
  )
}

const Sidebar = ({
  floems,
  handleNewItem,
  handleDeleteFloem,
  handleUpdateTitle,
}: {
  floems: DataFloem[]
  handleNewItem: (floem: DataFloem) => void
  handleDeleteFloem: (ids: string[]) => void
  handleUpdateTitle: (id: string, title: string) => void
}) => {
  return (
    <div className='bg-slate-900 h-screen flex flex-col'>
      <p className='text-4xl text-center mx-3 my-2 text-white italic'>FLOWDART</p>
      {floems.map(floem => (
        <Flowcard
          handleUpdateTitle={handleUpdateTitle}
          selected={state.selectedId === floem.id}
          key={`FloemSelector/${floem.id}`}
          floem={floem}
          onSelect={() => {
            state.selectedId = floem.id
          }}
          onDelete={() => {
            handleDeleteFloem([floem.id])
          }}
        />
      ))}
      <button className='tool-button mx-2' onClick={() => handleNewItem(genDummyFloem())}>
        <div>➕ New Floem ➕</div>
      </button>
    </div>
  )
}

export default App

export {}
