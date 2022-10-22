import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import { Edge, EdgeProps, getBezierPath } from 'reactflow'
import { DataDart } from '../../../model/core/dart'
import { Mutate } from '../../../model/core/mutators'

type Data = { dart: DataDart; mutate: Mutate }
export type FlowchartEdge = Edge<Data> & { data: Data }
export type FlowchartDartProps = EdgeProps<Data>

export default function FlowchartDart({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd = 'arrow',
  interactionWidth = 5,
}: FlowchartDartProps) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  if (!data) {
    return null
  }
  const { dart, mutate } = data

  const editor = useEditor({
    extensions: [
      Document.extend({
        addKeyboardShortcuts: () => ({
          enter: () => {
            return false
          },
        }),
      }),
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: 'condition',
        emptyNodeClass:
          'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none first:before:h-0',
      }),
    ],
    content: `${dart.case}`,
    onUpdate: ({ editor }) => {
      mutate.updateDart({ ...dart, case: editor.getText() })
    },

    editorProps: {
      attributes: {
        class: 'prose px-2 py-1 bg-white rounded shadow',
      },
    },
  })

  useEffect(() => {
    if (editor && dart.case !== editor.getText() && !editor.isFocused) {
      editor.commands.setContent(`${dart.case}`)
    }
  }, [dart.case])

  return (
    <>
      <path
        id={id}
        style={style}
        className='react-flow__edge-path'
        d={path}
        markerEnd={markerEnd}
      />
      {interactionWidth && (
        <path d={path} fill='none' strokeOpacity={0} strokeWidth={interactionWidth} />
      )}

      <foreignObject
        style={{ overflow: 'visible' }}
        x={(sourceX + targetX) / 2}
        y={(sourceY + targetY) / 2 - 18} // approx half the height of the editor
      >
        <EditorContent editor={editor} className='flex justify-center cursor-text' />
      </foreignObject>
    </>
  )
}
