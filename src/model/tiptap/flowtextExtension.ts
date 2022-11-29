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
import { uploadBlob } from './uploadBlob'
import Link from '@tiptap/extension-link'

const FlowtextExtension = Extension.create({
  addExtensions() {
    return [
      StarterKit.configure({ dropcursor: false, codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
      UniqueID.configure({ types: ['case'], generateID: genCaseId }),
      SwitchNode,
      CaseNode,
      AssigneeNode,
      Link,
      createImageExtension(uploadBlob),
    ] // TODO follow up with reactflow on fixing dropcursor rendering
  },
})

export default FlowtextExtension
