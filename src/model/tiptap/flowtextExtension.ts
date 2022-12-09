import UniqueID from '@tiptap-pro/extension-unique-id'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import Link from '@tiptap/extension-link'
import { Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { lowlight } from 'lowlight'
import { genId } from '../replicache/IdsAndKeys'
import AssigneeNode from './assigneeNode'
import CaseNode from './caseNode'
import ColumnNode from './columnNode'
import { createImageExtension } from './imageNode'
import RowNode from './rowNode'
import SwitchNode from './switchNode'
import { uploadBlob } from './uploadBlob'

export const HANDLE_ID_LENGTH = 7

const FlowtextExtension = Extension.create({
  addExtensions() {
    return [
      StarterKit.configure({ dropcursor: false, codeBlock: false }),
      Gapcursor,
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
      UniqueID.configure({ types: ['case'], generateID: genId(HANDLE_ID_LENGTH) }),
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
