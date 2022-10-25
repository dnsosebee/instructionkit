import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/react'

const SWITCH_INPUT_REGEX = /^(?: *(?<assignment>[A-z_]+[A-z0-9_]*) *=)? *\[$/

const SwitchNode = Node.create({
  name: 'switch',

  group: 'block',

  content: 'case*',

  parseHTML() {
    return [
      {
        tag: `switch`,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'switch',
      mergeAttributes(HTMLAttributes, {
        class: 'bg-blue-500 font-bold flex',
        'data-type': this.name,
      }),
      0,
    ]
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(Switch)
  // },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: SWITCH_INPUT_REGEX,
        type: this.type,
        getAttributes: match => ({
          language: match[1],
        }),
      }),
    ]
  },
})

export default SwitchNode
