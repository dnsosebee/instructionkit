import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../app'
import { FlowEditor } from './flowEditor'

export interface FlowNodeProps {
  mutate: Mutate
  flow: DataFlow
}

function FlowNode({ data: { mutate, flow } }: { data: FlowNodeProps }) {
  return (
    <div className='border overflow-hidden bg-zinc-50 shadow-2xl'>
      {flow.id != 'flow-start' ? (
        <Handle type='target' position={Position.Top} className='p-1' />
      ) : null}
      <FlowEditor flow={flow} mutate={mutate} />
      <Handle type='source' position={Position.Bottom} className='p-1' />
    </div>
  )
}

export default FlowNode
