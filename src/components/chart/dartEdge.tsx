import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'
import { getBezierPath, Position } from 'reactflow'
import { DataDart } from '../../model/core/floem'
import { Mutate } from '../../model/core/mutators'

export interface DartProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  style?: React.CSSProperties
  data?: { dart: DataDart; mutate: Mutate }
  markerEnd?: string | undefined
  interactionWidth?: number
}

export default function Dart({
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
}: DartProps) {
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
        placeholder: '↓',
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
