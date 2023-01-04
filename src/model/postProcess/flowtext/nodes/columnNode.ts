import {
  mergeAttributes,
  Node,
  nodeInputRule,
  ReactNodeViewRenderer,
  wrappingInputRule,
} from '@tiptap/react'
// import Column from '../../components/floem/tiptap/column'

const COL_INPUT_REGEX = /^\/col $/
const COLUMN_INPUT_REGEX = /^\/column $/

const ColumnNode = Node.create({
  name: 'column',

  group: 'block',

  content: 'block+',

  defining: true,

  parseHTML() {
    return [
      {
        tag: 'column',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // return ['column', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    return [
      'column',
      mergeAttributes(HTMLAttributes, {
        class: '',
      }),
      0,
    ]
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: COLUMN_INPUT_REGEX,
        type: this.type,
      }),
    ]
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(Column)
  // },
})

export default ColumnNode
