import { List } from 'immutable'
import { useEffect, useState } from 'react'
import { DataFloem } from '../../model/core/floem'
import { Mutate } from '../../model/core/mutators'
import { CallbackType, embark, Stone } from './boat'

interface RiverProps {
  mutate: Mutate
  floem: DataFloem
}

export type Riffle = List<JSX.Element>

export const River = ({ mutate, floem }: RiverProps) => {
  const [riffles, setRiffles] = useState<List<Riffle>>(List([List()]))

  const updateRiver = ({ paddle, element }: Stone) => {
    setRiffles(riffles => {
      const newRiffles = paddle ? riffles.push(List()) : riffles
      return newRiffles.set(-1, newRiffles.last()!.push(element))
    })
  }

  const callback: CallbackType = advance => () => {
    updateRiver(advance())
  }

  useEffect(() => updateRiver(embark({ flows: floem.flows, darts: floem.darts, callback })), [])

  return (
    <div className='grow flex flex-col h-full'>
      {riffles.map((riffle, i) => (
        <div key={i} className='flex-grow flex flex-col border-4'>
          {riffle.map((element, j) => (
            <div key={j} className='flex-grow flex flex-col'>
              {element}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
