import { InputRule, mergeAttributes, Node } from '@tiptap/react'
import { TextSelection } from 'prosemirror-state'

const SWITCH_INPUT_REGEX = /^(?: *(?<assignment>[A-z_]+[A-z0-9_]*) *= *)?\? $/
const CONDITION_SWITCH_INPUT_REGEX = /^(?: *(?<assignment>[A-z_]+[A-z0-9_]*) *= *)?\?\? $/

const SwitchNode = Node.create({
  name: 'switch',

  group: 'block',

  content: 'case*',

  addAttributes() {
    return {
      type: {
        default: 'button',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

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
      }),
      0,
    ]
  },
  addInputRules() {
    return [
      new InputRule({
        find: SWITCH_INPUT_REGEX,
        handler: ({ state, range }) => {
          state.tr
            .delete(range.from, range.to)
            .setBlockType(range.from, range.from, this.type, { type: 'button' })
            .replaceSelectionWith(state.schema.nodes.case.create())
            .setSelection(TextSelection.near(state.tr.doc.resolve(range.from + 1)))
            .insertText(' ')
        },
      }),
      new InputRule({
        find: CONDITION_SWITCH_INPUT_REGEX,
        handler: ({ state, range }) => {
          state.tr
            .delete(range.from, range.to)
            .setBlockType(range.from, range.from, this.type, { type: 'condition' })
            .replaceSelectionWith(state.schema.nodes.case.create())
            .setSelection(TextSelection.near(state.tr.doc.resolve(range.from + 1)))
            .insertText(' ')
        },
      }),
    ]
  },
})

export default SwitchNode
