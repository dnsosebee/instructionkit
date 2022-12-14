import { mergeAttributes, Node, ReactNodeViewRenderer, wrappingInputRule } from '@tiptap/react'
import Group from './group/group'

const ROW_INPUT_REGEX = /^\/row $/

const GroupNode = Node.create({
  name: 'row',

  group: 'block',

  content: 'block+',

  defining: true,

  joinable: false,

  addAttributes() {
    return {
      row: {
        default: 'false',
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
    console.log('Rendering HTML', HTMLAttributes)
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `group ${HTMLAttributes.row ? 'flex row' : 'column'}`,
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
