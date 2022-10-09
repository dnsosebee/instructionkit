import { first, last, initial } from 'lodash'
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
  const [path, setPath] = useState(['flow-start'])

  const darts = floem.darts.filter(v => v.from == flocation)
  const showContinueButton = darts.length > 0

  const paddle = () => {
    console.log('Paddling')
    const dart = first(darts)

    if (dart) {
      setPath([...path, dart.to])
      setFlocation(dart.to)
    }
  }

  const onClickBackButton = () => {
    setFlocation(last(path) as string)
    setPath(initial(path))
  }

  const flow = floem.flows.find(v => v.id == flocation) as DataFlow

  return (
    <div className='grow flex flex-col h-full'>
      <div className='bg-slate-800 flex justify-between p-1'>
        <div className='flex'>
          {path.length > 1 && (
            <button className='tool-button' onClick={onClickBackButton}>
              <div>❮</div>
            </button>
          )}
        </div>
        <button className='tool-button' onClick={stopFlowing}>
          <div>✕</div>
        </button>
      </div>
      {showContinueButton && (
        <button className='tool-button absolute right-1 bottom-1' onClick={paddle}>
          <div>Continue</div>
        </button>
      )}
      <Riffle flow={flow} mutate={mutate} paddle={paddle} />
    </div>
  )
}
