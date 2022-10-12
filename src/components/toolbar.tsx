import { DocumentMinusIcon, DocumentPlusIcon, PlayIcon } from '@heroicons/react/20/solid'
import { DataFlow } from '../model/core/flow'
import { Mutate } from '../model/core/mutators'
import { IconButton } from './iconButton'

export const Toolbar = ({ mutate, flow }: { mutate: Mutate; flow: DataFlow }) => {
  return (
    <div className='static'>
      <span className='isolate shadow bg-white rounded-bl-lg inline-flex overflow-hidden'>
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
        <IconButton Icon={PlayIcon} onClick={() => null} title='Embark' />
      </span>
    </div>
  )
}
