import { EditorContent, useEditor } from '@tiptap/react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import FlowtextExtension from '../../../../../model/postProcess/flowtext/nodes/flowtextExtension'
import { TextInput } from '../../../../../model/postProcess/flowtext/nodes/textInput'
import FlowtextProvider, { FlowtextContext, View } from '../flowchart/flowtext/flowtextProvider'
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

  const ref = useRef<HTMLInputElement>(null)
  // useEffect(() =>
  //   ref.current?.scrollIntoView({
  //     behavior: 'smooth',
  //   }),
  // )

  return (
    <motion.div className='stone opacity-0' animate={{ opacity: 1 }} ref={ref}>
      <div dangerouslySetInnerHTML={{ __html: fragment }} />
      <Advancer props={advancerProps} params={advancer.params} />
    </motion.div>
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
        class: 'grow flex items-center px-2',
      },
    },
  })

  return (
    <div className='flex border mt-5 w-min'>
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
  const [state, setState] = useState<{
    isOpen: boolean
    chosenValue: any
    chosenCaseId: string | undefined
  }>({
    isOpen: false,
    chosenValue: undefined,
    chosenCaseId: undefined,
  })

  const editor = useEditor({
    extensions: [FlowtextExtension],
    content: params.content,
    editable: false,
  })

  const onHopActive = (value: any, chosenCaseId?: string) => {
    setState({ ...state, isOpen: false, chosenValue: value, chosenCaseId })
    onHop(value, chosenCaseId)
  }

  const onHopInactive = (value: any, chosenCaseId?: string) => {
    setState({ ...state, isOpen: true, chosenValue: value, chosenCaseId: chosenCaseId })
  }

  const context: FlowtextContext<View.Guide> = {
    view: View.Guide,
    onHop: onHopActive, //active ? onHopActive : onHopInactive,
    chosenCaseId: state.chosenCaseId,
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
            onHop(state.chosenValue, state.chosenCaseId)
          }}
          onCancel={() => {
            setState({ ...state, isOpen: false })
          }}
        />
        <EditorContent editor={editor} className='mt-5' />
      </>
    </FlowtextProvider>
  )
}

const FinishButton = () => {
  return <></>
  // return <p className='italic'>fin</p>
}
