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
    <NodeViewWrapper className='flex flex-col bg-sky-500 relative border border-sky-500 rounded-md overflow-hidden'>
      <div className='bg-sky-500 px-2 justify-center'>
        <NodeViewContent className='text-center text-zinc-50' />
      </div>
      <div
        className='flex relative bg-zinc-50 hover:bg-sky-500 text-sky-500 hover:text-zinc-50 self-stretch justify-center duration-150'
        contentEditable={false}
      >
        <div className='text-xs self-center select-none ' contentEditable={false}>
          +
        </div>
        <Handle
          type={'source'}
          id={props.node.attrs.id}
          position={Position.Bottom}
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
          }}
        />
      </div>
    </NodeViewWrapper>
  )
}

export default Case
