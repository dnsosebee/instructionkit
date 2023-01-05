import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useEffect } from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { SwitchType } from '../../../../../../../model/postProcess/flowtext/nodes/switchNode'
import { parentAttrs } from '../../../../../../../model/postProcess/flowtext/nodes/utils'
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
  const isCondition = parentAttrs(props).switchtype === SwitchType.Condition
  const isGuide = context.view === View.Guide
  const isChart = context.view === View.Flowchart
  const isChosen = isGuide ? context.chosenCaseId === caseId : false

  const tagName = context.view === View.Flowchart ? 'div' : 'button'

  const buttonClasses = isGuide
    ? `duration-150 select-none ${
        isChosen
          ? 'bg-sky-500 text-zinc-50 selected'
          : 'bg-white hover:bg-sky-500 hover:text-zinc-50 text-sky-500 cursor-pointer not-selected'
      }`
    : 'bg-sky-500 text-zinc-50'

  return (
    <>
      <NodeViewWrapper
        className={`flex flex-col relative border border-sky-500 rounded-md mb-2 overflow-hidden ${buttonClasses}`}
        as='div'
      >
        <NodeViewContent
          className={`px-2 text-center ${isCondition && 'text-l33t'}`}
          as={tagName}
          {...(context.view === View.Guide
            ? { onClick: () => context.onHop(props.node.textContent, caseId) }
            : {})}
        />
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
    </>
  )
}

export default Case
