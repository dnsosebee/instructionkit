import { Handle, Position } from 'reactflow'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../../model/core/mutators'
import { FlowEditor } from './flowEditor'

export interface FlowNodeProps {
  mutate: Mutate
  flow: DataFlow
  selected: boolean
}

function FlowNode({ data: { mutate, flow, selected } }: { data: FlowNodeProps }) {
  return (
    <div
      className={`border overflow-hidden bg-zinc-50 shadow rounded-lg ${
        selected && 'border-indigo-500 outline-none ring-1 ring-indigo-500'
      }`}
    >
      {flow.id != 'flow-start' ? (
        <Handle type='target' position={Position.Top} className='p-1' />
      ) : null}
      <FlowEditor flow={flow} mutate={mutate} />
      <Handle type='source' position={Position.Bottom} className='p-1' />
    </div>
  )
}

export default FlowNode
