import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../app'

interface RiffleProps {
  mutate: Mutate
  flow: DataFlow
}

export const Riffle = ({ flow, mutate }: RiffleProps) => {
  return <div className='grow' dangerouslySetInnerHTML={{ __html: flow.flowtext }}></div>
}
