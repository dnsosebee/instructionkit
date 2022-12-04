import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'

// NOT CURRENTLY IN USE
export const Row = (props: NodeViewProps) => {
  return (
    <>
      <NodeViewWrapper className={`flex`} as='div' contentEditable={true}>
        <NodeViewContent className={``} as='p' />
        {/* <p className={`min-h-[30px] grow`} contentEditable={true}></p> */}
      </NodeViewWrapper>
    </>
  )
}

export default Row
