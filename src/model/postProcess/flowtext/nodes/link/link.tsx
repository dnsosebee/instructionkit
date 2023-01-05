import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import {
  useFlowtextContext,
  View,
} from '../../../../../components/views/app/project/flowchart/flowtext/flowtextProvider'

export const Link = (props: NodeViewProps) => {
  const context = useFlowtextContext()

  const isChart = context.view === View.Flowchart

  return (
    <>
      <NodeViewWrapper className={`flex`} as='div' contentEditable={true}>
        <NodeViewContent className={``} as='div' />
        <div>Test</div>
        <div contentEditable='false'>|</div>
        <div>View</div>
      </NodeViewWrapper>
    </>
  )
}

export default Link
