import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useEffect } from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { useFlowtextContext, View } from '../flowtextProvider'

export const Case = (props: NodeViewProps) => {
  const context = useFlowtextContext()

  if (context.view === View.Flowchart) {
    const updateNodeInternals = useUpdateNodeInternals()
    useEffect(() => {
      updateNodeInternals(
        (props.editor.options.editorProps.attributes as { [name: string]: string }).flow,
      )
    }, [props.node.content])
  }

  const caseId: string = props.node.attrs.id

  const isGuide = context.view === View.Guide
  const isChart = context.view === View.Flowchart
  const isChosen = isGuide ? context.chosenCaseId === caseId : false

  const TagName = context.view === View.Flowchart ? 'div' : 'button'

  const buttonClasses = isGuide
    ? `duration-150 select-none ${
        isChosen
          ? 'bg-sky-500 text-zinc-50'
          : 'bg-white hover:bg-sky-500 hover:text-zinc-50 text-sky-500 cursor-pointer'
      }`
    : 'bg-sky-500 text-zinc-50'

  return (
    <>
      <NodeViewWrapper
        className={`flex flex-col relative border border-sky-500 rounded-md overflow-hidden ${buttonClasses}`}
      >
        <TagName
          className='px-2 justify-center'
          {...(context.view === View.Guide ? { onClick: () => context.onHop(caseId) } : {})}
        >
          <NodeViewContent className='text-center' />
        </TagName>
        {isChart && (
          <div
            className='flex relative bg-zinc-50 hover:bg-sky-500 text-sky-500 hover:text-zinc-50 self-stretch justify-center duration-150'
            contentEditable={false}
          >
            <div className='text-xs self-center select-none relative z-50 pointer-events-none'>
              +
            </div>
            <Handle
              type={'source'}
              id={caseId}
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
        )}
      </NodeViewWrapper>
      {isChart && context.dartCases.includes(caseId) && (
        <div className='self-center relative w-0 h-0 z-40' contentEditable={false}>
          <div className='absolute w-0 -left-[0.5px] h-5 -bottom-3 border-l select-none pointer-events-none' />
        </div>
      )}
    </>
  )
}

export default Case
