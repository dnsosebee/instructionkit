import { InputRule, mergeAttributes, Node } from '@tiptap/react'
import { Fragment } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { findParentNodeOfType } from 'prosemirror-utils'
import { logger } from '../../lib/logger'
import { initialCase } from './caseNode'

const BUTTON_SWITCH_INPUT_REGEX = /^(?: *(?<assignee>[A-z_]+[A-z0-9_]*) *= *)?\? $/
const CONDITION_SWITCH_INPUT_REGEX = /^(?: *(?<assignee>[A-z_]+[A-z0-9_]*) *= *)?\?\? $/

export enum SwitchType {
  Condition = 'condition',
  Button = 'button',
}

const SwitchNode = Node.create({
  name: 'switch',

  group: 'block',

  content: 'assignee? (case)+',

  defining: true,

  editable: false,

  addAttributes() {
    return {
      switchtype: {
        default: 'button',
        parseHTML: element => element.getAttribute('data-switchtype'),
        renderHTML: attributes => ({
          'data-switchtype': attributes.switchtype,
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

  // addNodeView() {
  //   return ReactNodeViewRenderer(Switch)
  // },

  addInputRules() {
    return [
      switchInputRule(BUTTON_SWITCH_INPUT_REGEX, SwitchType.Button),
      switchInputRule(CONDITION_SWITCH_INPUT_REGEX, SwitchType.Condition),
    ]
  },
})

const switchInputRule = (regex: RegExp, switchtype: string): InputRule => {
  return new InputRule({
    find: regex,
    handler: ({ state, range, match }) => {
      logger.debug('SwitchNode.addInputRules.handler', { state, range, match })

      // make sure we're in a top level paragraph
      const rangeAsSelection = TextSelection.create(state.doc, range.from, range.to)
      const parentParagraph = findParentNodeOfType(state.schema.nodes.paragraph)(rangeAsSelection)
      if (!parentParagraph || parentParagraph.depth !== 1) {
        return
      }

      // create the switch's fragment
      const children = [initialCase(state)]
      if (switchtype === SwitchType.Button) {
        const assignee = match.groups?.assignee
        if (assignee) {
          const assigneeText = state.schema.text(assignee)
          const assigneeNode = state.schema.nodes.assignee.create({ name: assignee }, assigneeText)
          children.unshift(assigneeNode)
        }
      }
      const fragment = Fragment.fromArray(children)

      // create the switch
      const initialSwitch = state.schema.nodes.switch.create({ switchtype: switchtype }, fragment)

      // replace the paragraph with the switch
      state.tr
        .replaceRangeWith(range.from, range.to, initialSwitch)
        .setSelection(TextSelection.near(state.tr.doc.resolve(range.from + 1)))
    },
  })
}

export default SwitchNode
