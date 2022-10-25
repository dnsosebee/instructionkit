import { Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CaseNode from './caseNode'
import SwitchNode from './switchNode'

const FlowtextExtension = Extension.create({
  addExtensions() {
    return [StarterKit.configure({ dropcursor: false }), SwitchNode, CaseNode] // TODO follow up with reactflow on fixing dropcursor rendering
  },
})

export default FlowtextExtension
