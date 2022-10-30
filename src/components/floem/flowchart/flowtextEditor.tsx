import { EditorContent, useEditor } from '@tiptap/react'
import { applyDevTools } from 'prosemirror-dev-toolkit'
import { useEffect, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { logger } from '../../../logger'
import { DataFloem } from '../../../model/core/floem'
import { DataFlow, DEFAULT_FLOWTEXT } from '../../../model/core/flow'
import { genDartId, genFlowId } from '../../../model/core/ids'
import { Mutate } from '../../../model/core/mutators'
import FlowtextExtension from '../../../model/tiptap/flowtextExtension'
import FlowtextProvider, { View } from '../flowtextProvider'
import { useFlowchartContext } from './flowchartProvider'

export interface FlowtextEditorProps {
  flow: DataFlow
  floem: DataFloem
  mutate: Mutate
  isTop: boolean
  isBottom: boolean
  isStart: boolean
}

export const FlowtextEditor = (props: FlowtextEditorProps) => {
  const { flow, floem, mutate, isTop, isBottom, isStart } = props
  const { flocus, setFlocus } = useFlowchartContext()
  const propsRef = useRef(props) // TODO might need to ref even more

  const ExtensionWithShortcuts = FlowtextExtension.extend({
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          logger.debug('Enter')
          return false
        },
        Tab: () => {
          logger.debug('trying to branch...')
          const parentOfSelection = this.editor.state.selection.$from.parent
          logger.debug(parentOfSelection)
          if (parentOfSelection.type === this.editor.schema.nodes.case) {
            const caseId = parentOfSelection.attrs.id
            const existingDart = propsRef.current.floem.darts.find(
              dart => dart.case === caseId && dart.from === propsRef.current.flow.id,
            )
            if (existingDart) {
              logger.debug('existing dart')
              setFlocus(existingDart.to)
            } else {
              const newFlowId = genFlowId()
              mutate.addFlow({
                floemId: floem.id,
                flow: {
                  id: newFlowId,
                  flowtext: DEFAULT_FLOWTEXT,
                  position: flow.position,
                },
              })
              mutate.addDart({
                floem: floem.id, // WARNING this will fail if there's an ID collision: rethink or move to longer UUIDs
                dart: {
                  id: genDartId(),
                  from: flow.id,
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
    if (flocus === flow.id) {
      contentEditor?.commands.focus()
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
            // id='default!!!'
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
          id='default!!!'
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
