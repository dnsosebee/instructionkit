import { first, initial, last } from 'lodash'
import { useState, useEffect } from 'react'
import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../../model/core/mutators'
import { Riffle } from './riffle'
import { Stone, CallbackType, AdvancerType, embark } from './boat'

interface RiverProps {
  mutate: Mutate
  floem: DataFloem
}

export const River = ({ mutate, floem }: RiverProps) => {
  const [riffles, setRiffles] = useState<string[]>([''])
  const [advancer, setAdvancer] = useState<AdvancerType>()

  const updateRiver = ({ paddle, html, advancer: newAdvancer }: Stone) => {
    console.log('Updating river with HTML:', html)
    console.log('riffles: ', riffles)
    const newRiffles = [...riffles]

    if (paddle) {
      console.log('Paddling to a new riffle')
      newRiffles.push('')
    }
    newRiffles[newRiffles.length - 1] = last(newRiffles) + html
    console.log(`New Riffles: ${newRiffles}`)

    setRiffles(newRiffles)
    setAdvancer(newAdvancer)
  }

  const callback: CallbackType = advance => () => {
    updateRiver(advance())
  }

  useEffect(() => updateRiver(embark({ flows: floem.flows, darts: floem.darts, callback })), [])

  return (
    <div className='grow flex flex-col h-full'>
      <div className='bg-slate-800 flex justify-between p-1'></div>
      <div dangerouslySetInnerHTML={{ __html: last(riffles)! }} />
      {advancer}
    </div>
  )
}
