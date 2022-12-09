import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import { DataFloem } from '../../../model/replicache/spaces/proj-[id]/entries/dart/floem'
import { WorkspaceMutate } from '../../../model/replicache/spaces/proj-[id]/projectMutators'

interface TitleEditorProps {
  mutate: WorkspaceMutate
  classNames: string
  floem: DataFloem
}

export const TitleEditor = ({ mutate, classNames, floem }: TitleEditorProps) => {
  const editor = useEditor({
    extensions: [
      Document.extend({
        addKeyboardShortcuts: () => ({
          Enter: () => {
            return true
          },
        }),
      }),
      Paragraph,
      Text,
    ],
    content: `${floem.title}`,
    onUpdate: ({ editor }) => {
      mutate.updateFloem({ id: floem.id, title: editor.getText(), updatedAt: Date.now() })
    },

    editorProps: {
      attributes: {
        class: classNames,
      },
    },
  })

  useEffect(() => {
    if (editor && floem.title !== editor.getText() && !editor.isFocused) {
      editor.commands.setContent(`${floem.title}`)
    }
  }, [floem.title])

  return <EditorContent editor={editor} />
}
