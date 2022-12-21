import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useFlowtextContext, View } from '../flowtextProvider'

export const Assignee = (props: NodeViewProps) => {
  const context = useFlowtextContext()

  const isChart = context.view === View.Flowchart

  return isChart ? (
    <NodeViewWrapper as='div' className='flex mb-2'>
      <NodeViewContent className='text-center text-l33t px-2' as={'div'} />
      <div contentEditable={false} className='text-center pointer-events-none px-2'>
        =
      </div>
    </NodeViewWrapper>
  ) : (
    <></>
  )
}

export default Assignee
