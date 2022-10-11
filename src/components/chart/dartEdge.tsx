import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'
import { getBezierPath, Position } from 'reactflow'
import { DataDart } from '../../model/core/floem'
import { Mutate } from '../app'

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
}: DartProps) {
  const [edgePath] = getBezierPath({
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
    extensions: [Document, Paragraph, Text],
    content: `${dart.case}`,
    onUpdate: ({ editor }) => {
      mutate.updateDart({ ...dart, case: editor.getText() })
    },
    editorProps: {
      attributes: {
        class: 'prose',
      },
    },
  })

  return (
    <>
      <path
        id={id}
        style={style}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        style={{ overflow: 'visible' }}
        width={1000}
        x={(sourceX + targetX) / 2 - 500}
        y={(sourceY + targetY) / 2}
      >
        <EditorContent editor={editor} className='flex justify-center cursor-text' />
      </foreignObject>
    </>
  )
}
