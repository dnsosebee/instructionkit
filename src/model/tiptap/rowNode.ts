import {
  mergeAttributes,
  Node,
  nodeInputRule,
  ReactNodeViewRenderer,
  wrappingInputRule,
} from '@tiptap/react'
import Row from '../../components/floem/tiptap/row'

const ROW_INPUT_REGEX = /^\/row $/

const RowNode = Node.create({
  name: 'row',

  group: 'block',

  content: 'block+',

  defining: true,

  // allowGapCursor: true,

  parseHTML() {
    return [
      {
        tag: 'row',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // return ['row', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    return [
      'row',
      mergeAttributes(HTMLAttributes, {
        class: 'flex',
      }),
      0,
    ]
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: ROW_INPUT_REGEX,
        type: this.type,
      }),
    ]
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(Row)
  // },
})

export default RowNode
