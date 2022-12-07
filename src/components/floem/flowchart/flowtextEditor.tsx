import { EditorContent, useEditor } from '@tiptap/react'
import { applyDevTools } from 'prosemirror-dev-toolkit'
import { findParentNodeOfType } from 'prosemirror-utils'
import { useEffect, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { logger } from '../../../logger'
import { CASE_DEFAULT_ID, genDartId, genFlowId } from '../../../model/replicache-spaces/ws-[id]/ids'
import { DataFloem } from '../../../model/replicache-spaces/ws-[id]/keys/floem/floem'
import {
  DataFlow,
  DEFAULT_FLOWTEXT,
} from '../../../model/replicache-spaces/ws-[id]/keys/floem/flow'
import { WorkspaceMutate } from '../../../model/replicache-spaces/ws-[id]/workspaceMutators'
import FlowtextExtension from '../../../model/tiptap/flowtextExtension'
import FlowtextProvider, { View } from '../flowtextProvider'
import { useFlowchartContext } from './flowchartProvider'

export interface FlowtextEditorProps {
  flow: DataFlow
  floem: DataFloem
  mutate: WorkspaceMutate
  isTop: boolean
  isBottom: boolean
  isStart: boolean
}

export const FlowtextEditor = (props: FlowtextEditorProps) => {
  const { flow, floem, mutate, isTop, isBottom, isStart } = props
  const { flocus, setFlocus } = useFlowchartContext()
  const propsRef = useRef(props) // TODO might need to ref even more

  //keep propsRef up to date
  useEffect(() => {
    propsRef.current = props
  }, [props])

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

            const existingDart = propsRef.current.floem.darts.find(
              dart => dart.case === caseId && dart.from === propsRef.current.flow.id,
            )
            if (existingDart) {
              logger.debug('existing dart')
              setFlocus(existingDart.to)
            } else {
              const newFlowId = genFlowId()
              const flowPos = propsRef.current.flow.position
              mutate.addFlow({
                floemId: propsRef.current.floem.id,
                flow: {
                  id: newFlowId,
                  flowtext: DEFAULT_FLOWTEXT,
                  position: {
                    x: flowPos.x + xOffset,
                    y: flowPos.y + yOffset,
                  },
                },
              })
              mutate.addDart({
                floem: propsRef.current.floem.id, // WARNING this will fail if there's an ID collision: rethink or move to longer UUIDs
                dart: {
                  id: genDartId(),
                  from: propsRef.current.flow.id,
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
    content: `${flow.flowtext}`,
    onCreate({ editor }) {
      if (process.env.NODE_ENV !== 'production') {
        applyDevTools(editor.view)
      }
    },
    onUpdate: ({ editor }) => {
      mutate.updateFlow({ id: flow.id, floem: floem.id, flowtext: editor.getHTML() })
    },
    editorProps: {
      attributes: {
        flow: flow.id,
        class:
          'chart-prose py-3 prose prose-hr:border-2 prose-hr:border-black cursor-text prose-hr:selected:border-blue-600',
      },
    },
  })

  useEffect(() => {
    if (contentEditor && flow.flowtext !== contentEditor.getHTML() && !contentEditor.isFocused) {
      contentEditor.commands.setContent(`${flow.flowtext}`)
    }
  }, [flow.flowtext])

  useEffect(() => {
    if (contentEditor && flocus === flow.id) {
      contentEditor.commands.focus()
      setFlocus(null)
    }
  }, [flocus, !!contentEditor])

  const dartCases = floem.darts.filter(v => v.from === flow.id).map(v => v.case)

  return (
    <div className={`list-disc flex-grow cursor-default nodrag bg-zinc-50`}>
      {isStart || (
        <div className='flex flex-col bg-transparent bg-inherit relative justify-center text-sky-500 hover:bg-sky-500 hover:text-zinc-50 duration-150'>
          {isTop || (
            <div className='fringe-top z-10 width-full bg-inherit'>
              <div className='bg-inherit' />
            </div>
          )}
          <div className='my-1 text-xs font-bold self-center select-none relative z-50 pointer-events-none'>
            +
          </div>
          <Handle
            type='target'
            position={Position.Top}
            className='z-20 opacity-0'
            style={{ top: 0, width: '100%', height: '100%' }}
          />
        </div>
      )}
      <FlowtextProvider context={{ view: View.Flowchart, dartCases }}>
        <EditorContent editor={contentEditor} key={`CE/${flow.id}`} />
      </FlowtextProvider>
      <div className='flex flex-col bg-transparent bg-inherit relative justify-center text-sky-500 hover:bg-sky-500 hover:text-zinc-50 duration-150'>
        <div className='my-1 text-xs font-bold self-center select-none relative z-50 pointer-events-none'>
          +
        </div>
        <Handle
          id={CASE_DEFAULT_ID}
          type='source'
          position={Position.Bottom}
          className='z-20 opacity-0'
          style={{ top: 0, width: '100%', height: '100%' }}
        />
        {isBottom || (
          <div className='fringe-bottom z-10 width-full bg-inherit'>
            <div className='bg-inherit' />
          </div>
        )}
      </div>
    </div>
  )
}
