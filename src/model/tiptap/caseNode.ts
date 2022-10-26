import { mergeAttributes, Node, nodeInputRule, ReactNodeViewRenderer } from '@tiptap/react'
import Case from '../../components/floem/tiptap/case'

const CASE_INPUT_REGEX = /^\|$/

const CaseNode = Node.create({
  name: 'case',

  content: 'text*',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'case',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['case', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Case)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: CASE_INPUT_REGEX,
        type: this.type,
      }),
    ]
  },
})

export default CaseNode
