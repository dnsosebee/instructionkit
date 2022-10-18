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
  const isStart = flow.id == 'flow-start'
  const isTop = !floem.darts.find(v => v.to == flow.id)
  const isBottom = !floem.darts.find(v => v.from == flow.id)

  return (
    <div className=' w-96'>
      {isTop || (
        <div className='fringe-top mx-4'>
          <div className='bg-zinc-50' />
        </div>
      )}
      {isStart ? (
        <div className='pb-1 w-full'>
          <TitleEditor
            mutate={mutate}
            floem={floem}
            classNames='text-3xl font-bold tracking-tight text-gray-50 cursor-text nodrag p-2'
          />
        </div>
      ) : (
        <Handle type='target' position={Position.Top} className='p-1 z-10' />
      )}
      <div
        className={`overflow-hidden bg-slate-900 shadow rounded-lg cursor-move ${
          selected && 'border-indigo-500 outline-none ring-1 ring-indigo-500'
        }`}
      >
        <FlowEditor flow={flow} mutate={mutate} isTop={isTop} isBottom={isBottom} />
        <Handle type='source' position={Position.Bottom} className='p-1 z-10' />
      </div>
      {isBottom || (
        <div className='fringe-bottom mx-4'>
          <div className='bg-zinc-50' />
        </div>
      )}
    </div>
  )
}

export default FlowNode
