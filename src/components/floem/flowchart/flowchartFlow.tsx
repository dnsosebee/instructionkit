import { Node, NodeProps } from 'reactflow'
import { FLOW_START_ID } from '../../../model/replicache-spaces/ws-[id]/ids'
import { DataFloem } from '../../../model/replicache-spaces/ws-[id]/keys/floem/floem'
import { DataFlow } from '../../../model/replicache-spaces/ws-[id]/keys/floem/flow'
import { WorkspaceMutate } from '../../../model/replicache-spaces/ws-[id]/workspaceMutators'
import { FlowtextEditor } from './flowtextEditor'

type Data = {
  mutate: WorkspaceMutate
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
    <div className='w-96'>
      {/* {
        isStart ? (
          <div className='pb-1 w-full'>
            <TitleEditor
              mutate={mutate}
              floem={floem}
              classNames='text-3xl font-bold tracking-tight text-gray-50 cursor-text nodrag p-2'
            />
          </div>
        ) : null // <Handle type='target' position={Position.Top} className='p-1 z-10' />
      } */}
      <div
        className={`px-4 ${isTop ? 'pt-4' : ''} ${
          isBottom ? 'pb-4' : ''
        } bg-slate-900 shadow rounded-lg cursor-move ${
          selected && 'border-indigo-500 outline-none ring-1 ring-indigo-500'
        }`}
      >
        <FlowtextEditor
          flow={flow}
          mutate={mutate}
          isTop={isTop}
          isBottom={isBottom}
          isStart={isStart}
          floem={floem}
        />
      </div>
    </div>
  )
}

export default FlowchartFlow
