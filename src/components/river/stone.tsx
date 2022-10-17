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
    <>
      <div dangerouslySetInnerHTML={{ __html: fragment }} className='prose' />
      <Advancer {...props} />
    </>
  )
}

export type NextButtonParams = {
  text: string
}

const NextButton = (params: NextButtonParams) => (props: AdvancerProps) => {
  const { active, onHop } = props
  return (
    <button disabled={!active} className='tool-button' onClick={() => onHop(null)}>
      {params.text}
    </button>
  )
}

export type ChoiceParams = {
  choices: string[]
}

const Choice = (params: ChoiceParams) => (props: AdvancerProps) => {
  const { active, value, onHop } = props
  return (
    <div className='flex justify-center'>
      {params.choices.map(choice => (
        <button disabled={!active} className='tool-button m-1' onClick={() => onHop(choice)}>
          {choice}
        </button>
      ))}
    </div>
  )
}

const FinishButton = () => () => {
  return <p className='italic'>fin</p>
}
