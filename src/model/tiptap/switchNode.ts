import { InputRule, mergeAttributes, Node } from '@tiptap/react'
import { TextSelection } from 'prosemirror-state'

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
        class: 'font-bold flex',
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
      new InputRule({
        find: SWITCH_INPUT_REGEX,
        handler: ({ state, range }) => {
          const $start = state.doc.resolve(range.from)
          const tr = state.tr
            .delete(range.from, range.to)
            .setBlockType(range.from, range.from, this.type)
            .replaceSelectionWith(state.schema.nodes.case.create())
            .setSelection(TextSelection.near(state.tr.doc.resolve(range.from + 1)))
            .insertText(' ')
        },
      }),
    ]
  },
})

export default SwitchNode
