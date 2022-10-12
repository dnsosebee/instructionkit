import { Handle, Position } from 'reactflow'
import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../../model/core/mutators'
import { TitleEditor } from '../titleEditor'
import { FlowEditor } from './flowEditor'

export interface FlowNodeProps {
  mutate: Mutate
  flow: DataFlow
  selected: boolean
  floem: DataFloem
}

function FlowNode({ data: { mutate, flow, selected, floem } }: { data: FlowNodeProps }) {
  return (
    <div className=' w-96'>
      {flow.id === 'flow-start' ? (
        <div className='pb-1 w-full'>
          <TitleEditor
            mutate={mutate}
            floem={floem}
            classNames='text-3xl font-bold tracking-tight text-gray-900 cursor-text nodrag p-2'
          />
        </div>
      ) : (
        <Handle type='target' position={Position.Top} className='p-1' />
      )}
      <div
        className={`border overflow-hidden bg-zinc-50 shadow rounded-lg ${
          selected && 'border-indigo-500 outline-none ring-1 ring-indigo-500'
        }`}
      >
        <FlowEditor flow={flow} mutate={mutate} />
        <Handle type='source' position={Position.Bottom} className='p-1' />
      </div>
    </div>
  )
}

export default FlowNode
