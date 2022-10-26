import UniqueID from '@tiptap-pro/extension-unique-id'
import { Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { genCaseId } from '../core/ids'
import CaseNode from './caseNode'
import SwitchNode from './switchNode'

const FlowtextExtension = Extension.create({
  addExtensions() {
    return [
      StarterKit.configure({ dropcursor: false }),
      UniqueID.configure({ types: ['case'], generateID: genCaseId }),
      SwitchNode,
      CaseNode,
    ] // TODO follow up with reactflow on fixing dropcursor rendering
  },
})

export default FlowtextExtension
