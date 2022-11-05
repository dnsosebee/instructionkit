import UniqueID from '@tiptap-pro/extension-unique-id'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { lowlight } from 'lowlight'
import { genCaseId } from '../core/ids'
import AssigneeNode from './assigneeNode'
import CaseNode from './caseNode'
import SwitchNode from './switchNode'
import { createImageExtension } from './imageNode'

const uploadFn = async (file: File) => {
  console.log('Faking upload of file', file.name)
  return 'http://polytrope.com/favicon.png'
}

const FlowtextExtension = Extension.create({
  addExtensions() {
    return [
      StarterKit.configure({ dropcursor: false, codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
      UniqueID.configure({ types: ['case'], generateID: genCaseId }),
      SwitchNode,
      CaseNode,
      AssigneeNode,
      createImageExtension(uploadFn),
    ] // TODO follow up with reactflow on fixing dropcursor rendering
  },
})

export default FlowtextExtension
