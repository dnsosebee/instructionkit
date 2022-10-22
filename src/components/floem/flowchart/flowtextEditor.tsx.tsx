import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { DataFlow } from '../../../model/core/flow'
import { Mutate } from '../../../model/core/mutators'

export interface FlowtextEditorProps {
  flow: DataFlow
  mutate: Mutate
  isTop: boolean
  isBottom: boolean
}

export const FlowtextEditor = ({
  flow,
  mutate,
  isTop: isTop,
  isBottom: isBottom,
}: FlowtextEditorProps) => {
  // Content stuff
  const contentEditor = useEditor({
    extensions: [StarterKit.configure({ dropcursor: false })], // TODO follow up with reactflow on fixing dropcursor rendering
    content: `${flow.flowtext}`,
    onUpdate: ({ editor }) => {
      mutate.updateFlow({ id: flow.id, floem: flow.floem, flowtext: editor.getHTML() })
    },
    editorProps: {
      attributes: {
        class:
          'chart-prose py-3 prose prose-hr:border-2 prose-hr:border-black cursor-text prose-hr:selected:border-blue-600',
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
        isTop ? 'rounded-t mt-4' : ''
      } ${isBottom ? 'rounded-b mb-4' : ''}`}
    >
      <EditorContent editor={contentEditor} key={`CE/${flow.id}`} />
    </div>
  )
}
