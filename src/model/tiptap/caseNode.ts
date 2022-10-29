import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'
import { EditorState } from 'prosemirror-state'
import Case from '../../components/floem/tiptap/case'

const CaseNode = Node.create({
  name: 'case',

  content: 'text*',

  marks: '',

  parseHTML() {
    return [
      {
        tag: 'case',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'case',
      mergeAttributes(HTMLAttributes, {
        class: '',
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Case)
  },

  // addInputRules() {
  //   return [
  //     new InputRule({
  //       find: CASE_INPUT_REGEX,
  //       handler: ({ state, range }) => {
  //         logger.debug('CaseNode.addInputRules.handler', { state, range })
  //         if (hasParentNodeOfType(state.schema.nodes.switch)(state.selection)) {
  //           logger.debug('CaseNode.addInputRules.handler: hasParentNode')
  //           const tr = state.tr.delete(range.from, range.to)
  //           const indexInParent = tr.doc.resolve(range.from).index(1)
  //           const caseNode = initialCase(state)
  //           // insert caseNode after current caseNode
  //           tr.insert(range.from + 1, caseNode).setSelection(
  //             TextSelection.near(tr.doc.resolve(range.from + 1)),
  //           )
  //         }
  //       },
  //     }),
  //   ]
  // },
})

// const initialText = (state: EditorState) => state.schema.text('')
export const initialCase = (state: EditorState) => state.schema.nodes.case.create({})

export default CaseNode
