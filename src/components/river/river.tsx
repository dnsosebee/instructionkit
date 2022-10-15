import { List, Map } from 'immutable'
import { useEffect } from 'react'
import { proxy, snapshot, useSnapshot } from 'valtio'
import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../../model/core/mutators'
import { stoneAt } from './boat'

interface RiverProps {
  mutate: Mutate
  floem: DataFloem
}

type LValue = string
type RValue = any
type VarMap = Map<LValue, RValue>

export interface FlowState {
  vars: VarMap
  flocation: {
    flow: DataFlow['id']
    node: number
  }
}

export interface StoneProps {
  active: boolean
  value: any
  onHop: (value: any) => void
}

interface Stone<T> {
  value: T
  flowState: (value: any) => FlowState
  view: (props: StoneProps) => JSX.Element
  paddleAfter: boolean
}
const WELCOME_STONE: Stone<null> = {
  value: null,
  flowState: () => ({
    vars: Map(),
    flocation: {
      flow: 'flow-start',
      node: 0,
    },
  }),
  view: ({ active, onHop }) => {
    if (!active) {
      return <></>
    }
    return (
      <div>
        <h1>Welcome to the river</h1>
        <button onClick={() => onHop(null)}>Start</button>
      </div>
    )
  },
  paddleAfter: true,
}

export type StoneType = Stone<string> | Stone<number> | Stone<boolean> | Stone<null>

export type Riffle = List<StoneType>

// setup valtio state
const state = proxy({
  riffleList: {
    riffles: List<Riffle>([List<StoneType>([WELCOME_STONE] as StoneType[])] as Riffle[]),
    activeRiffle: 0,
  },
})

const rewindAndApply = (
  riffleIdx: number,
  stoneIdx: number,
  value: any,
  paddleAfter: boolean,
  floem: DataFloem,
) => {
  const riffleList = state.riffleList
  const riffle = riffleList.riffles.get(riffleIdx)!
  const stone = riffle.get(stoneIdx)!
  const updatedRiffle = riffle
    .set(stoneIdx, {
      ...stone,
      value,
    })
    .slice(0, stoneIdx + 1)
  let updatedRiffles = riffleList.riffles.set(riffleIdx, updatedRiffle).slice(0, riffleIdx + 1)
  let updatedActiveRiffle = riffleList.activeRiffle
  const newStone = stoneAt(floem, stone.flowState(value))
  if (paddleAfter) {
    const newRiffle = List<StoneType>([newStone])
    updatedRiffles = updatedRiffles.push(newRiffle)
    updatedActiveRiffle = updatedRiffles.size - 1
  } else {
    updatedRiffles = updatedRiffles.set(riffleIdx, updatedRiffle.push(newStone))
  }
  state.riffleList = {
    riffles: updatedRiffles,
    activeRiffle: updatedActiveRiffle,
  }
  console.log('rewindAndApply', snapshot(state))
}

export const River = ({ floem }: RiverProps) => {
  const { riffles, activeRiffle } = useSnapshot(state.riffleList)

  useEffect(() => {
    console.log('River useEffect', riffles, activeRiffle)
  }, [riffles, activeRiffle])
  return (
    <div>
      <p>{activeRiffle}</p>
      {riffles.map((riffle, riffleIdx) => riffle.map(v => <p>{v.value}</p>))}
      {riffles.map((riffle, i) => (
        <div key={i}>
          {riffle.map((stone, j) => (
            <stone.view
              key={j}
              {...{
                active: i === activeRiffle && j === riffle.size - 1,
                value: stone.value,
                onHop: value => {
                  rewindAndApply(i, j, value, stone.paddleAfter, floem)
                },
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
