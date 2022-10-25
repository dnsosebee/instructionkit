import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Handle, Position } from 'reactflow'

export const Case = (props: any) => {
  return (
    <NodeViewWrapper className='border border-green-400 m-1 flex flex-col'>
      <NodeViewContent />
      <div contentEditable={false} className='relative'>
        <Handle type={'source'} id={props.node.attrs.id} position={Position.Bottom} />
      </div>
    </NodeViewWrapper>
  )
}

export default Case
