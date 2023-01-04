import { EditorContent, useEditor } from '@tiptap/react'
import { findParentNodeOfType } from 'prosemirror-utils'
import React, { useEffect } from 'react'
import { logger as parentLogger } from '../../../../../../lib/logger'
import FlowtextExtension from '../../../../../../model/postProcess/flowtext/nodes/flowtextExtension'
import { genDartId } from '../../../../../../model/schema/types/dart/baseDart'
import { GOTO_DART_TYPE } from '../../../../../../model/schema/types/dart/types/goto'
import { genFlowId } from '../../../../../../model/schema/types/flow/baseFlow'
import {
  BranchFlow,
  BRANCH_FLOW_TYPE,
  EMPTY_BRANCH_FLOWTEXT,
} from '../../../../../../model/schema/types/flow/types/branch'
import { useFlowchartCtx } from '../../../../../loaders/providers/flowchartProvider'
import FlowtextProvider, { View } from './flowtextProvider'

const logger = parentLogger.child({ component: 'FlowtextEditor' })

export const FlowtextEditor = ({ branch }: { branch: BranchFlow }) => {
  const { flocus, setFlocus, darts, send } = useFlowchartCtx()

  const positionRef = React.useRef(branch.position)
  useEffect(() => {
    positionRef.current = branch.position
  }, [branch.position])

  const dartsRef = React.useRef(darts)
  useEffect(() => {
    dartsRef.current = darts
  }, [darts])

  const ExtensionWithShortcuts = FlowtextExtension.extend({
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          logger.debug('Enter')
          return false
        },
        Tab: () => {
          // probably shouhld clean this up
          logger.debug('trying to branch...')
          const selection = this.editor.state.selection
          const parentOfSelection = selection.$from.parent
          const caseNodeType = this.editor.schema.nodes.case
          logger.debug(parentOfSelection)
          if (parentOfSelection.type === caseNodeType) {
            const caseId = parentOfSelection.attrs.id
            const switchNodeType = this.editor.schema.nodes.switch
            const parentSwitch = findParentNodeOfType(switchNodeType)(selection)
            if (parentSwitch === undefined) {
              throw new Error('case should have a switch parent')
            }
            const switchNode = parentSwitch.node
            let index = 0
            let found = false
            switchNode.content.forEach(node => {
              if (node.type === caseNodeType && !found) {
                if (node.attrs.id === caseId) {
                  found = true
                } else {
                  index++
                }
              }
            })
            const xOffset = (found ? index * 400 : 0) - 250
            const yOffset = 500

            const existingEdge = dartsRef.current.find(
              edge => edge.case === caseId && edge.from === branch.id,
            )
            if (existingEdge) {
              logger.debug('existing edge')
              setFlocus(existingEdge.to)
            } else {
              const newFlowId = genFlowId()
              const flowPos = positionRef.current
              send({
                action: 'createFlow',
                flow: {
                  type: BRANCH_FLOW_TYPE,
                  id: newFlowId,
                  flowtext: EMPTY_BRANCH_FLOWTEXT,
                  position: {
                    x: flowPos.x + xOffset,
                    y: flowPos.y + yOffset,
                  },
                },
              })
              send({
                action: 'createDart',
                dart: {
                  type: GOTO_DART_TYPE,
                  id: genDartId(),
                  from: branch.id,
                  case: caseId,
                  to: newFlowId,
                },
              })
              setFlocus(newFlowId)
            }

            return true
          }
          return false
        },
      }
    },
  })
  // Content stuff
  const contentEditor = useEditor({
    extensions: [ExtensionWithShortcuts],
    content: branch.flowtext,
    // // uncomment if you want ProseMirror debug tools; but know that this injects bad CSS into the application, so LEAVE IT COMMENTED!
    // onCreate({ editor }) {
    //   if (process.env.NODE_ENV !== 'production') {
    //     applyDevTools(editor.view)
    //   }
    // },
    onUpdate: ({ editor }) => {
      send({
        action: 'updateFlow',
        update: {
          id: branch.id,
          flowtext: editor.getHTML(),
        },
      })
    },
    // onBlur: ({ editor }) => {
    //   editor.setEditable(false)
    // },
    // onFocus: ({ editor }) => {
    //   editor.setEditable(true)
    // },
    editorProps: {
      attributes: {
        flow: branch.id,
        class:
          'chart-prose py-3 prose prose-hr:border-2 prose-hr:border-black cursor-text prose-hr:selected:border-blue-600',
      },
    },
  })

  useEffect(() => {
    if (contentEditor && branch.flowtext !== contentEditor.getHTML() && !contentEditor.isFocused) {
      contentEditor.commands.setContent(`${branch.flowtext}`)
    }
  }, [branch.flowtext])

  useEffect(() => {
    if (contentEditor && flocus === branch.id) {
      contentEditor.commands.focus()
      setFlocus(null)
    }
  }, [flocus, !!contentEditor])

  const edgeCases = darts.filter(v => v.from === branch.id).map(v => v.case)
  return (
    <FlowtextProvider context={{ view: View.Flowchart, dartCases: edgeCases }}>
      <EditorContent editor={contentEditor} key={`EC/${branch.id}`} />
    </FlowtextProvider>
  )
}
