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
    <div className='grow riffle prose' dangerouslySetInnerHTML={{ __html: flow.flowtext }}></div>
  )
}
