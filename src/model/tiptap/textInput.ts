import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Extension } from '@tiptap/react'

export const TextInput = Extension.create({
  addExtensions() {
    return [
      Document.extend({
        content: 'block',
      }),
      Paragraph,
      Text,
    ]
  },
})
