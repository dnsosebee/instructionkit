import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'
import FlowtextExtension from '../../../model/tiptap/flowtextExtension'
import { TextInput } from '../../../model/tiptap/textInput'
import FlowtextProvider, { FlowtextContext, View } from '../flowtextProvider'
import AlertModal from './alertModal'
import { AdvancerProps, StepUIConfig } from './guide'

export const StoneView = ({
  uiConfig,
  advancerProps,
}: {
  uiConfig: StepUIConfig
  advancerProps: AdvancerProps
}) => {
  const { fragment, advancer } = uiConfig
  let Advancer: React.FC<{ props: AdvancerProps; params: any }>
  switch (advancer.type) {
    case 'pause':
      Advancer = NextButton
      break
    case 'choice':
      Advancer = Choice
      break
    case 'string':
      Advancer = StringInput
      break
    case 'finish':
      Advancer = FinishButton
      break
    default:
      throw new Error(`Unknown advancer type: ${advancer.type}`)
  }
  return (
    <div className='stone'>
      <div dangerouslySetInnerHTML={{ __html: fragment }} className='prose' />
      <Advancer props={advancerProps} params={advancer.params} />
    </div>
  )
}

export type NextButtonParams = {
  text: string
}

const NextButton = ({ params, props }: { params: NextButtonParams; props: AdvancerProps }) => {
  const { active, onHop } = props
  return (
    <>
      {active && (
        <button
          disabled={!active}
          className='inline-flex items-center rounded-md border border-gray-300 bg-white mt-5 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-center cursor-pointer'
          onClick={() => onHop(null)}
        >
          {params.text}
        </button>
      )}
    </>
  )
}

export type StringInputParams = {
  defaultString: string
  text: string
}

const StringInput = ({ params, props }: { params: StringInputParams; props: AdvancerProps }) => {
  const { onHop, value, active } = props

  const editor = useEditor({
    extensions: [TextInput],
    content: params.defaultString,
    editorProps: {
      attributes: {
        class: 'grow flex items-center px-1',
      },
    },
  })

  return (
    <div className='flex border'>
      <EditorContent editor={editor} className='grow flex' />
      <button
        disabled={!active && editor?.getText() == value}
        className='standard-button'
        onClick={() => onHop(editor?.getText())}
      >
        ✓
      </button>
    </div>
  )
}

export type ChoiceParams = {
  content: string
}

const Choice = ({ params, props }: { params: ChoiceParams; props: AdvancerProps }) => {
  const { active, value, onHop } = props
  const [state, setState] = useState<{ isOpen: boolean; choice: any }>({
    isOpen: false,
    choice: null,
  })

  const editor = useEditor({
    extensions: [FlowtextExtension],
    content: params.content,
    editable: false,
  })

  const onHopInactive = (value: any) => {
    setState({ isOpen: true, choice: value })
  }

  const context: FlowtextContext<View.Guide> = {
    view: View.Guide,
    onHop: active ? onHop : onHopInactive,
  }

  return (
    <FlowtextProvider context={context}>
      <>
        <AlertModal
          open={state.isOpen}
          titleText='Changing paths...'
          descriptionText='This will rewind history and put you on a new path. Are you sure?'
          buttonText='Yes, Rewind'
          onProceed={() => {
            setState({ ...state, isOpen: false })
            onHop(state.choice)
          }}
          onCancel={() => {
            setState({ ...state, isOpen: false })
          }}
        />
        <EditorContent editor={editor} />
      </>
    </FlowtextProvider>
  )
}

const FinishButton = () => {
  return <></>
  // return <p className='italic'>fin</p>
}
