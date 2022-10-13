import { List } from 'immutable'
import { useEffect, useState } from 'react'
import { DataFloem } from '../../model/core/floem'
import { Mutate } from '../../model/core/mutators'
import { AdvancerType, CallbackType, embark, Stone } from './boat'

interface RiverProps {
  mutate: Mutate
  floem: DataFloem
}

export const River = ({ mutate, floem }: RiverProps) => {
  const [riffles, setRiffles] = useState<List<string>>(List(['']))
  const [advancer, setAdvancer] = useState<AdvancerType>()

  const updateRiver = ({ paddle, html, advancer: newAdvancer }: Stone) => {
    console.log('Updating river with HTML:', html)
    console.log('riffles: ', riffles)
    setRiffles(riffles => {
      const newRiffles = paddle ? riffles.push('') : riffles
      return newRiffles.set(-1, newRiffles.last() + html)
    })
    setAdvancer(newAdvancer)
  }

  const callback: CallbackType = advance => () => {
    updateRiver(advance())
  }

  useEffect(() => updateRiver(embark({ flows: floem.flows, darts: floem.darts, callback })), [])

  return (
    <div className='grow flex flex-col h-full'>
      <div className='bg-slate-800 flex justify-between p-1'></div>
      <div className='prose' dangerouslySetInnerHTML={{ __html: riffles.last() }} />
      {advancer}
    </div>
  )
}
