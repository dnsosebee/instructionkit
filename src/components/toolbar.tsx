import { DocumentMinusIcon, DocumentPlusIcon, PlayIcon } from '@heroicons/react/20/solid'
import { DataFlow } from '../model/core/flow'
import { Mutate } from '../model/core/mutators'
import { IconButton } from './iconButton'

export const Toolbar = ({ mutate, flow }: { mutate: Mutate; flow: DataFlow }) => {
  return (
    <span className='inline-flex space-x-1'>
      <IconButton
        Icon={DocumentPlusIcon}
        onClick={() => mutate.addFlow(flow.floem)}
        title='Add Flow'
      />
      <IconButton
        Icon={DocumentMinusIcon}
        onClick={() => mutate.removeFlow({ floemId: flow.floem, flowId: flow.id })}
        title='Delete Flow'
      />
      <div className='w-2'> </div>
      <IconButton Icon={PlayIcon} onClick={() => null} title='Embark' />
    </span>
  )
}
