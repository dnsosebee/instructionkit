import { mergeAttributes, Node, ReactNodeViewRenderer, wrappingInputRule } from '@tiptap/react'
import Group from './group/group'

const ROW_INPUT_REGEX = /^\/row $/

const GroupNode = Node.create({
  name: 'group',

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      row: {
        default: 'false',
      },
      id: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        class: 'group',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `group basis-64 grow ${HTMLAttributes.row ? 'flex row flex-wrap' : 'column'}`,
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

  addNodeView() {
    return ReactNodeViewRenderer(Group)
  },
})

export default GroupNode
