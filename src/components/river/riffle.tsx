import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../app'

interface RiffleProps {
  mutate: Mutate
  flow: DataFlow
  paddle: () => void
}

export const Riffle = ({ flow, mutate, paddle }: RiffleProps) => {
  return (
    <div className='flex grow justify-center items-center bg-slate-100'>
      <div
        className='riffle prose min-w-[400px] m-4 p-6 shadow-2xl bg-white'
        dangerouslySetInnerHTML={{ __html: flow.flowtext }}
      ></div>
    </div>
  )
}
