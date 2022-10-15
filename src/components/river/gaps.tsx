import { StoneProps } from './river'

export const NextButton = (paddleAfter: boolean, fragment: JSX.Element) => (props: StoneProps) => {
  const { active, value, onHop } = props
  return (
    <div>
      {fragment}
      {active && (
        <button onClick={() => onHop(value)}> {paddleAfter ? 'Next Riffle' : 'Next'} </button>
      )}
    </div>
  )
}
