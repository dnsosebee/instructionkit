import { useState } from 'react'
import AlertModal from '../alertModal'
import { AdvancerProps, StoneUIConfig } from './river'

export const StoneView = (uiConfig: StoneUIConfig) => (props: AdvancerProps) => {
  const { fragment, advancer } = uiConfig
  let Advancer: (props: AdvancerProps) => JSX.Element
  switch (advancer.type) {
    case 'pause':
      Advancer = NextButton(advancer.params)
      break
    case 'choice':
      Advancer = Choice(advancer.params)
      break
    case 'finish':
      Advancer = FinishButton()
      break
    default:
      throw new Error(`Unknown advancer type: ${advancer.type}`)
  }
  return (
    <div className='stone'>
      <div dangerouslySetInnerHTML={{ __html: fragment }} className='prose' />
      <Advancer {...props} />
    </div>
  )
}

export type NextButtonParams = {
  text: string
}

const NextButton = (params: NextButtonParams) => (props: AdvancerProps) => {
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

export type ChoiceParams = {
  choices: string[]
}

const Choice = (params: ChoiceParams) => (props: AdvancerProps) => {
  const { active, value, onHop } = props
  const [state, setState] = useState<{ isOpen: boolean; onProceed: () => void }>({
    isOpen: false,
    onProceed: () => {
      throw new Error('onProceed not set')
    },
  })

  return (
    <>
      <AlertModal
        open={state.isOpen}
        titleText='Changing paths...'
        descriptionText='This will rewind history and put you on a new path. Are you sure?'
        buttonText='Yes, Rewind'
        onProceed={state.onProceed}
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
                  onProceed: () => {
                    onHop(choice)
                  },
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

const FinishButton = () => () => {
  return <></>
  // return <p className='italic'>fin</p>
}
