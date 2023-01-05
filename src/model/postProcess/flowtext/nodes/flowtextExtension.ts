import UniqueID from '@tiptap-pro/extension-unique-id'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { lowlight } from 'lowlight'
import { genId } from '../../../schema/id'
import AssigneeNode from './assigneeNode'
import CaseNode from './caseNode'
import GroupNode from './groupNode'
import { uploadBlob } from './image/uploadBlob'
import { createImageExtension } from './imageNode'
import SwitchNode from './switchNode'

export const CASE_ID_LENGTH = 7
export const DEFAULT_CASE_ID = 'default' // this is seven characters long

const FlowtextExtension = Extension.create({
  addExtensions() {
    return [
      StarterKit.configure({ dropcursor: false, codeBlock: false }),
      Gapcursor,
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
      UniqueID.configure({ types: ['case'], generateID: genId(CASE_ID_LENGTH) }),
      SwitchNode,
      GroupNode,
      CaseNode,
      AssigneeNode,
      // LinkNode,
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose',
        },
      }),
      TaskItem.configure({
        nested: true,
      }),
      createImageExtension(uploadBlob),
    ] // TODO follow up with reactflow on fixing dropcursor rendering
  },
})

export default FlowtextExtension
