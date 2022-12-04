import UniqueID from '@tiptap-pro/extension-unique-id'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { lowlight } from 'lowlight'
import { genCaseId } from '../replicache-spaces/ws-[id]/ids'
import AssigneeNode from './assigneeNode'
import CaseNode from './caseNode'
import { createImageExtension } from './imageNode'
import SwitchNode from './switchNode'
import RowNode from './rowNode'
import ColumnNode from './columnNode'
import { uploadBlob } from './uploadBlob'
import Link from '@tiptap/extension-link'
import { Gapcursor } from '@tiptap/extension-gapcursor'

const FlowtextExtension = Extension.create({
  addExtensions() {
    return [
      StarterKit.configure({ dropcursor: false, codeBlock: false }),
      Gapcursor,
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
      UniqueID.configure({ types: ['case'], generateID: genCaseId }),
      SwitchNode,
      RowNode,
      ColumnNode,
      CaseNode,
      AssigneeNode,
      Link,
      createImageExtension(uploadBlob),
    ] // TODO follow up with reactflow on fixing dropcursor rendering
  },
})

export default FlowtextExtension
