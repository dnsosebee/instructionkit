import { InputRule, mergeAttributes, Node } from '@tiptap/react'
import { TextSelection } from 'prosemirror-state'
import { findParentNodeOfType } from 'prosemirror-utils'
import { initialCase } from './caseNode'

const BUTTON_SWITCH_INPUT_REGEX = /^(?: *(?<assignment>[A-z_]+[A-z0-9_]*) *= *)?\? $/
const CONDITION_SWITCH_INPUT_REGEX = /^(?: *(?<assignment>[A-z_]+[A-z0-9_]*) *= *)?\?\? $/

enum SwitchType {
  Condition = 'condition',
  Button = 'button',
}

const SwitchNode = Node.create({
  name: 'switch',

  group: 'block',

  content: '(case)+',

  defining: true,

  editable: false,

  addAttributes() {
    return {
      switchtype: {
        default: 'button',
        parseHTML: element => element.getAttribute('data-switchtype'),
        renderHTML: attributes => ({
          'data-switchtype': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'switch',
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
      switchInputRule(BUTTON_SWITCH_INPUT_REGEX, SwitchType.Button),
      switchInputRule(CONDITION_SWITCH_INPUT_REGEX, SwitchType.Condition),
    ]
  },
})

const switchInputRule = (regex: RegExp, type: string): InputRule => {
  return new InputRule({
    find: regex,
    handler: ({ state, range }) => {
      // make sure we're in a top level paragraph
      const rangeAsSelection = TextSelection.create(state.doc, range.from, range.to)
      const parentParagraph = findParentNodeOfType(state.schema.nodes.paragraph)(rangeAsSelection)
      if (!parentParagraph || parentParagraph.depth !== 1) {
        return
      }
      const initialSwitch = state.schema.nodes.switch.create({ type }, initialCase(state))
      state.tr
        .replaceRangeWith(range.from, range.to, initialSwitch)
        .setSelection(TextSelection.near(state.tr.doc.resolve(range.from + 1)))
    },
  })
}

export default SwitchNode
