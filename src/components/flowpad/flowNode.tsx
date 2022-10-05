import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Flow } from '../../model/core/flow'
import { Mutate } from '../app'
import { FlowEditor } from './flowEditor'

export interface FlowNodeProps {
  mutate: Mutate
  flow: Flow
}

function FlowNode({ data: { mutate, flow } }: { data: FlowNodeProps }) {
  return (
    <div className='border overflow-hidden bg-zinc-50 shadow-2xl'>
      <Handle type='target' position={Position.Top} className='p-1' />
      <FlowEditor flow={flow} mutate={mutate} />
      <Handle type='source' position={Position.Bottom} className='p-1' />
    </div>
  )
}

export default FlowNode
