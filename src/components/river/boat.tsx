import assert from 'assert'
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
  riffleChunks: string[][]
}

export interface Stone {
  paddle: boolean
  html: string
  advancer: AdvancerType // continue or input or whatever
}

const toRiffleChunks = (flowtext: string) =>
  flowtext.split(RIFFLE_SEPARATOR).map(v => v.split(STONE_SEPARATOR))

export const newStone = ({
  flows,
  darts,
  callback,
  flocation,
  riffleChunks,
}: NewStoneData): Stone => {
  assert(riffleChunks.length > 1 || (riffleChunks.length > 0 && riffleChunks[0].length > 0))
  let paddle = false

  if (riffleChunks[0].length == 0) {
    paddle = true
    riffleChunks.shift()
  }

  if (riffleChunks.length === 1 && riffleChunks[0].length === 1) {
    const branches = darts.filter(v => v.from == flocation)
    // console.log(
    //   `Navigating to new flocation from ${flocation}.\nDarts: ${darts}\nBranches: ${branches}`,
    //   darts,
    // )
    if (branches.length === 0) {
      return {
        paddle: false,
        html: riffleChunks[0][0],
        advancer: <div className='bg-slate-800 flex justify-between p-1'></div>,
      }
    }
    const dart = branches[0] // TODO flogic
    flocation = dart.to
    const flow = flows.find(v => v.id == flocation)!
    const oldStoneChunk = riffleChunks[0][0]
    riffleChunks = toRiffleChunks(flow.flowtext)
    riffleChunks[0][0] = oldStoneChunk + riffleChunks[0][0]
    if (paddle) {
      riffleChunks = [[], ...riffleChunks] // hacky and we should have a better type
    }
    // console.log(`Moving to new flocation: ${flocation}\nChunks: ${riffleChunks}`)
    return newStone({ flows, darts, callback, flocation, riffleChunks })
  }

  const stoneChunks = riffleChunks[0]
  const html = stoneChunks.shift()!

  // TODO use flows and darts and flocation and riffles to figure out paddle, html, and create JSX object for advancer
  return {
    paddle,
    html,
    advancer: (
      <button
        className='tool-button'
        onClick={callback(() =>
          newStone({
            flows,
            darts,
            flocation,
            riffleChunks,
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
    riffleChunks: toRiffleChunks(data.flows.find(flow => flow.id === 'flow-start')!.flowtext),
  })
}
