import { DataDart } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'

const STONE_SEPARATOR = '...'
const RIFFLE_SEPARATOR = '<hr>'

type AdvanceType = () => Stone

export type CallbackType = (advance: AdvanceType) => () => void

export type AdvancerType = JSX.Element

export interface EmbarkData {
  flows: DataFlow[]
  darts: DataDart[]
  callback: CallbackType
}

interface NewStoneData extends EmbarkData {
  flocation: DataFlow['id']
  chunks: string[][]
}

export interface Stone {
  paddle: boolean
  html: string
  advancer: AdvancerType // continue or input or whatever
}

const toRiffles = (flowtext: string) =>
  flowtext.split(STONE_SEPARATOR).map(v => v.split(STONE_SEPARATOR))

export const newStone = ({ flows, darts, callback, flocation, chunks }: NewStoneData): Stone => {
  console.log('Generating next stone…', chunks)
  // TODO use flows and darts and flocation and riffles to figure out paddle, html, and create JSX object for advancer
  return {
    paddle: false,
    html: 'figure this out soon',
    advancer: (
      <button
        onClick={callback(() =>
          newStone({
            flows,
            darts,
            flocation,
            chunks,
            callback,
          }),
        )}
      >
        next
      </button>
    ),
  }
}

export const embark = (data: EmbarkData) => {
  console.log('Embarking on an epic riverine journey')
  return newStone({
    ...data,
    flocation: 'flow-start',
    chunks: toRiffles(data.flows.find(flow => flow.id === 'flow-start')!.flowtext),
  })
}
