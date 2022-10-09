import { useState } from 'react'
import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../app'
import { Riffle } from './riffle'

interface RiverProps {
  mutate: Mutate
  floem: DataFloem
}

export const River = ({ floem, mutate }: RiverProps) => {
  const [flocation, setFlocation] = useState('flow-start')

  const flow = floem.flows.find(v => v.id == flocation) as DataFlow

  return (
    <div className='grow'>
      <Riffle flow={flow} mutate={mutate}></Riffle>
    </div>
  )
}
