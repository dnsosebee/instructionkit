import { trim } from 'lodash'
import { DataDart } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Stone } from './stone'

const STONE_SEPARATOR = '...'
const RIFFLE_SEPARATOR = '<hr>'
const INPUT_REGEX = /hello world/

export type CallbackType = (advance: () => Stone) => () => void

export interface EmbarkData {
  flows: DataFlow[]
  darts: DataDart[]
  callback: CallbackType
}

export const embark = (data: EmbarkData) => {
  console.log('Embarking on an epic riverine journey')
  return newStone({
    ...data,
    flocation: 'flow-start',
    hopper: refill(data.flows, 'flow-start'),
    fragment: { paddle: true, children: [] },
  })
}

export interface NewStoneData extends EmbarkData {
  flocation: DataFlow['id']
  hopper: ChildNode[]
  fragment: Fragment
}

interface Fragment {
  paddle: boolean
  children: ChildNode[]
}

export interface Stone {
  paddle: boolean // true if the stone is the beginning of a riffle
  element: JSX.Element
}

const domParser = new DOMParser()

const refill = (flows: DataFlow[], id: DataFlow['id']): ChildNode[] => {
  const flow = flows.find(f => f.id === id)!
  const body = domParser.parseFromString(flow.flowtext, 'text/html').body
  return Array.from(body.childNodes)
}

const newStone = (data: NewStoneData): Stone => {
  const { flows, darts, callback, fragment } = data
  let { flocation, hopper } = data

  if (hopper.length === 0) {
    const branches = darts.filter(v => v.from == flocation)
    if (branches.length === 0) {
      return {
        paddle: fragment.paddle,
        element: <div>{fragment.children}</div>,
      }
    }
    const dart = branches[0] // TODO flogic
    flocation = dart.to
    const flow = flows.find(v => v.id == flocation)!
    hopper = refill(flows, flocation)
    return newStone(data)
  }

  const node: ChildNode = hopper.shift()!
  let match

  if (node.nodeName === 'HR') {
    return {
      paddle: fragment.paddle,
      element: (
        <Stone>
          <>
            {fragment.children}
            <NextButton {...data} fragment={{ ...fragment, paddle: true }} />
          </>
        </Stone>
      ),
    }
  } else if (node.nodeName == 'P' && (match = node.nodeValue?.match(/^(...)|…$/g))) {
    return {
      paddle: fragment.paddle,
      element: (
        <Stone>
          <>
            {fragment.children}
            <NextButton {...data} fragment={{ ...fragment, paddle: false }} />
          </>
        </Stone>
      ),
    }
  } else if (
    node.nodeName == 'P' &&
    (match = node.nodeValue?.match(
      /(?<=^|\n)(?:(?<assignment>[A-z_]+[A-z0-9_]*) *=)? *\[ *(?<choices>(?:(?:(?:(?:[A-z0-9_!?*'"()^$.]+[A-z0-9_!?*'"()^$ .]*)(?:(?:, *)|(?= *\])))){2,}))\](?=$|\n)/g,
    ))
  ) {
    const choices = match.groups!.choices.split(',').map(trim)
    return {
      paddle: fragment.paddle,
      element: (
        <Stone>
          <>
            {fragment.children}
            <GapChoice
              data={{ ...data, fragment: { ...data.fragment, paddle: false } }}
              assignment={match.groups!.assignment}
              choices={choices}
            />
          </>
        </Stone>
      ),
    }
  }

  fragment.children.push(node)
  return newStone(data)
}

const NextButton = (data: NewStoneData) => {
  const { callback } = data
  return <button onClick={callback(() => newStone(data))}>next</button>
}

interface ChoiceProps {
  assignment: string | undefined
  choices: string[]
  data: NewStoneData
}

const GapChoice = ({ data, assignment, choices }: ChoiceProps) => {
  console.log(assignment)
  const { callback } = data
  return (
    <span>
      {choices.map(v => (
        <button onClick={callback(() => newStone(data))}>{v}</button>
      ))}
    </span>
  )
}
