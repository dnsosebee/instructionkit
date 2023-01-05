import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'

interface TitleEditorProps {
  title: string
  handleUpdate: (updatedTitle: string) => void
  className: string
}

export const TitleEditor = ({ title, className: classNames, handleUpdate }: TitleEditorProps) => {
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
    content: `${title}`,
    onUpdate: ({ editor }) => {
      handleUpdate(editor.getText())
    },

    editorProps: {
      attributes: {
        class: classNames,
      },
    },
  })

  useEffect(() => {
    if (editor && title !== editor.getText() && !editor.isFocused) {
      editor.commands.setContent(title)
    }
  }, [title])

  return <EditorContent editor={editor} />
}
