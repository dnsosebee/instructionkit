import { EditorContent, useEditor } from '@tiptap/react'
import { applyDevTools } from 'prosemirror-dev-toolkit'
import { useEffect } from 'react'
import { DataFloem } from '../../../model/core/floem'
import { DataFlow } from '../../../model/core/flow'
import { Mutate } from '../../../model/core/mutators'
import FlowtextExtension from '../../../model/tiptap/flowtextExtension'
import FlowtextProvider, { View } from '../flowtextProvider'

export interface FlowtextEditorProps {
  flow: DataFlow
  floem: DataFloem
  mutate: Mutate
  isTop: boolean
  isBottom: boolean
}

export const FlowtextEditor = ({
  flow,
  floem,
  mutate,
  isTop: isTop,
  isBottom: isBottom,
}: FlowtextEditorProps) => {
  // Content stuff
  const contentEditor = useEditor({
    extensions: [FlowtextExtension],
    content: `${flow.flowtext}`,
    onCreate({ editor }) {
      if (process.env.NODE_ENV !== 'production') {
        applyDevTools(editor.view)
      }
    },
    onUpdate: ({ editor }) => {
      mutate.updateFlow({ id: flow.id, floem: floem.id, flowtext: editor.getHTML() })
    },
    editorProps: {
      attributes: {
        flow: flow.id,
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

  const dartCases = floem.darts.filter(v => v.from === flow.id).map(v => v.case)

  return (
    <div
      className={`list-disc flex-grow cursor-default nodrag bg-zinc-50 mx-4 ${
        isTop ? 'rounded-t mt-4' : ''
      } ${isBottom ? 'rounded-b mb-4' : ''}`}
    >
      <FlowtextProvider context={{ view: View.Flowchart, dartCases }}>
        <EditorContent editor={contentEditor} key={`CE/${flow.id}`} />
      </FlowtextProvider>
    </div>
  )
}
