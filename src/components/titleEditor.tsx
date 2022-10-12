import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import { DataFloem } from '../model/core/floem'
import { Mutate } from '../model/core/mutators'

interface TitleEditorProps {
  mutate: Mutate
  classNames: string
  floem: DataFloem
}

export const TitleEditor = ({ mutate, classNames, floem }: TitleEditorProps) => {
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
    ],
    content: `${floem.title}`,
    onUpdate: ({ editor }) => {
      mutate.updateFloem({ id: floem.id, title: editor.getText() })
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
