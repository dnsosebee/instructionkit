import { useState } from 'react'
import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../app'
import { Riffle } from './riffle'

interface RiverProps {
  mutate: Mutate
  floem: DataFloem
  stopFlowing: () => void
}

export const River = ({ floem, mutate, stopFlowing }: RiverProps) => {
  const [flocation, setFlocation] = useState('flow-start')

  const flow = floem.flows.find(v => v.id == flocation) as DataFlow

  return (
    <div className='grow'>
      <button className='tool-button fixed right-1 top-1' onClick={stopFlowing}>
        <div>✕</div>
      </button>
      <Riffle flow={flow} mutate={mutate}></Riffle>
    </div>
  )
}
