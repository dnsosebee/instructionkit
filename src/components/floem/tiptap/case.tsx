import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useEffect } from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'

export const Case = (props: NodeViewProps) => {
  const updateNodeInternals = useUpdateNodeInternals()
  useEffect(() => {
    updateNodeInternals(
      (props.editor.options.editorProps.attributes as { [name: string]: string }).flow,
    )
  }, [props.node.content])
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
