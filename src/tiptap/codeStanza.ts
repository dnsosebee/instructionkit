// This is a tiptap block that can be dragged around the page.

import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'
import CodeStanzaView from '../components/flowpad/tiptap/codeStanzaView'

export interface CodeStanzaOptions {
  HTMLAttributes: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeStanza: {
      /**
       * Toggle a code stanza
       */
      toggleCodeStanza: () => ReturnType
    }
  }
}

export const CodeStanza = Node.create<CodeStanzaOptions>({
  name: 'codeStanza',

  group: 'stanza',

  content: 'codeBlock',

  draggable: true,

  parseHTML() {
    return [{ tag: 'code-stanza' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['code-stanza', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeStanzaView)
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from, empty } = selection

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
        const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')

        if (!isAtEnd || !endsWithDoubleNewline) {
          return false
        }

        return editor
          .chain()
          .command(({ tr }) => {
            tr.delete($from.pos - 2, $from.pos)

            return true
          })
          .exitCode()
          .run()
      },
    }
  },
})
