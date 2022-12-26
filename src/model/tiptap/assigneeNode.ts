import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import { EditorState } from 'prosemirror-state'
import Assignee from '../../components/views/app/project/flowchart/flowtext/nodes/assignee'
import CaseNode from './caseNode'

const AssigneeNode = CaseNode.extend({
  name: 'assignee',

  parseHTML() {
    return [
      {
        tag: 'assignee',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'assignee',
      mergeAttributes(HTMLAttributes, {
        class: '',
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Assignee)
  },
})

// const initialText = (state: EditorState) => state.schema.text('')
export const initialCase = (state: EditorState) => state.schema.nodes.case.create({})

export default AssigneeNode
