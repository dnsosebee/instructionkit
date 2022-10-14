import { trim } from 'lodash'
import { HTMLElement, NodeType, parse } from 'node-html-parser'
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
  hopper: HTMLElement[]
  fragment: Fragment
}

interface Fragment {
  paddle: boolean
  children: HTMLElement[]
}

export interface Stone {
  paddle: boolean // true if the stone is the beginning of a riffle
  element: JSX.Element
}

const toJsx = (elements: HTMLElement[]) => (
  <div dangerouslySetInnerHTML={{ __html: elements.map(e => e.toString()).join('') }} />
)

const refill = (flows: DataFlow[], id: DataFlow['id']): HTMLElement[] => {
  const flow = flows.find(f => f.id === id)!
  const body = parse(flow.flowtext)
  const childElements = body.childNodes.filter(
    c => c.nodeType === NodeType.ELEMENT_NODE,
  ) as HTMLElement[] // redundant probably
  return Array.from(childElements)
}

const newStone = (data: NewStoneData): Stone => {
  const { flows, darts, fragment } = data

  if (data.hopper.length === 0) {
    const branches = darts.filter(v => v.from == data.flocation)
    if (branches.length === 0) {
      return {
        paddle: fragment.paddle,
        element: toJsx(fragment.children),
      }
    }
    const dart = branches[0] // TODO flogic
    const flocation = dart.to
    const hopper = refill(flows, flocation)
    return newStone({ ...data, flocation, hopper })
  }

  const el = data.hopper.shift()!
  let match

  console.log('el', el.rawText)

  if (el.tagName === 'HR') {
    return {
      paddle: fragment.paddle,
      element: (
        <Stone>
          <>
            {toJsx(fragment.children)}
            <NextButton {...data} fragment={{ children: [], paddle: true }} />
          </>
        </Stone>
      ),
    }
  } else if (el.tagName === 'P' && (match = el.innerText?.match(/^(...)|…$/g))) {
    return {
      paddle: fragment.paddle,
      element: (
        <Stone>
          <>
            {toJsx(fragment.children)}
            <NextButton {...data} fragment={{ children: [], paddle: false }} />
          </>
        </Stone>
      ),
    }
  } else if (
    el.tagName === 'p' &&
    (match = el.innerText?.match(
      /(?<=^|\n)(?:(?<assignment>[A-z_]+[A-z0-9_]*) *=)? *\[ *(?<choices>(?:(?:(?:(?:[A-z0-9_!?*'"()^$.]+[A-z0-9_!?*'"()^$ .]*)(?:(?:, *)|(?= *\])))){2,}))\](?=$|\n)/g,
    ))
  ) {
    const choices = match.groups!.choices.split(',').map(trim)
    return {
      paddle: fragment.paddle,
      element: (
        <Stone>
          <>
            {toJsx(fragment.children)}
            <GapChoice
              data={{ ...data, fragment: { children: [], paddle: false } }}
              assignment={match.groups!.assignment}
              choices={choices}
            />
          </>
        </Stone>
      ),
    }
  }

  fragment.children.push(el)
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
