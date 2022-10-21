import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'
import { TextInput } from '../../tiptap/textInput'
import AlertModal from '../alertModal'
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
        className='inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 m-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-center cursor-pointer'
        onClick={() => onHop(editor?.getText())}
      >
        ✔️
      </button>
    </div>
  )
}

export type ChoiceParams = {
  choices: string[]
}

const Choice = ({ params, props }: { params: ChoiceParams; props: AdvancerProps }) => {
  const { active, value, onHop } = props
  const [state, setState] = useState<{ isOpen: boolean; choice: any }>({
    isOpen: false,
    choice: null,
  })

  return (
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
      <span className={'isolate inline-flex rounded-md shadow-sm self-center'}>
        {params.choices.map((choice, i) => (
          <button
            key={i}
            type='button'
            className={`relative -ml-px inline-flex items-center border border-gray-300 bg-white mt-5 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
              i == 0 ? 'rounded-l-md' : ''
            } ${i == params.choices.length - 1 ? 'rounded-r-md' : ''}
            ${value == choice ? 'bg-indigo-50 text-indigo-700' : ''}`}
            onClick={() => {
              if (!active) {
                setState({
                  isOpen: true,
                  choice,
                })
              } else {
                onHop(choice)
              }
            }}
          >
            {choice}
          </button>
        ))}
      </span>
    </>
  )
}

const FinishButton = () => {
  return <></>
  // return <p className='italic'>fin</p>
}
