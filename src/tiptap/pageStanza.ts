// This is a tiptap block that can be dragged around the page.

import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import pageStanzaView from '../components/flowchart/tiptap/pageStanzaView'

export interface PageStanzaOptions {
  HTMLAttributes: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const PageStanza = Node.create<PageStanzaOptions>({
  name: 'pageStanza',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'stanza',

  content: 'block+',

  defining: true,

  draggable: true,

  parseHTML() {
    return [{ tag: 'page-stanza' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['page-stanza', HTMLAttributes, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(pageStanzaView)
  },
})
