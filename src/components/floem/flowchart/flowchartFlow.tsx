import { Handle, Node, NodeProps, Position } from 'reactflow'
import { DataFloem } from '../../../model/core/floem'
import { DataFlow } from '../../../model/core/flow'
import { FLOW_START_ID } from '../../../model/core/ids'
import { Mutate } from '../../../model/core/mutators'
import { FlowtextEditor } from './flowtextEditor'
import { TitleEditor } from './titleEditor'

type Data = {
  mutate: Mutate
  flow: DataFlow
  floem: DataFloem
}
export type FlowchartNode = Node<Data>
export type FlowchartFlowProps = NodeProps<Data>

function FlowchartFlow({ data: { mutate, flow, floem }, selected }: FlowchartFlowProps) {
  const isStart = flow.id === FLOW_START_ID
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
        <FlowtextEditor
          flow={flow}
          mutate={mutate}
          isTop={isTop}
          isBottom={isBottom}
          floem={floem.id}
        />
      </div>
      {isBottom || (
        <div className='fringe-bottom mx-4'>
          <div className='bg-zinc-50' />
        </div>
      )}
    </div>
  )
}

export default FlowchartFlow
