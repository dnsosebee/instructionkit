import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../../model/core/mutators'

export const PREVENT_TIPTAP_DEFAULT = true
export const ALLOW_TIPTAP_DEFAULT = false

export interface FlowEditorProps {
  flow: DataFlow
  mutate: Mutate
  isStart: boolean
  isEnd: boolean
}

export const FlowEditor = ({ flow, mutate, isStart, isEnd }: FlowEditorProps) => {
  const flowRef = useRef(flow)
  // keep ref up to date with new props
  useEffect(() => {
    flowRef.current = flow
  }, [flow])

  // Content stuff
  const contentEditor = useEditor({
    extensions: [StarterKit.configure({ dropcursor: false })], //.configure({ horizontalRule: { HTMLAttributes: { class: 'h-5' } } })],
    content: `${flowRef.current.flowtext}`,
    onUpdate: ({ editor }) => {
      mutate.updateFlow({ ...flowRef.current, flowtext: editor.getHTML() })
    },
    editorProps: {
      attributes: {
        class: `chart-prose py-5 prose prose-hr:border-2 prose-hr:border-black cursor-text prose-hr:selected:border-blue-600 ${
          isStart ? 'mt-4' : ''
        } ${isEnd ? 'mb-4' : ''}`,
      },
    },
  })

  useEffect(() => {
    if (contentEditor && flow.flowtext !== contentEditor.getHTML() && !contentEditor.isFocused) {
      contentEditor.commands.setContent(`${flow.flowtext}`)
    }
  }, [flow.flowtext])

  return (
    <div
      className={`list-disc flex-grow cursor-default nodrag bg-zinc-50 mx-4 ${
        isStart ? 'rounded-t' : ''
      } ${isEnd ? 'rounded-b' : ''}`}
    >
      <EditorContent editor={contentEditor} key={`CE/${flow.id}`} />
    </div>
  )
}
