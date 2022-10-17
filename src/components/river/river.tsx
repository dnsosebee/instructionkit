import { List, Map } from 'immutable'
import { useState } from 'react'
import { DataFloem } from '../../model/core/floem'
import { DataFlow } from '../../model/core/flow'
import { Mutate } from '../../model/core/mutators'
import { riverStoneAt } from './boat'
import { StoneView } from './stone'

export interface RiverProps {
  mutate: Mutate
  floem: DataFloem
}

export type VarMap = Map<string, any>

export interface Flocation {
  flow: DataFlow['id']
  node: number
}

export interface AdvancerProps {
  active: boolean
  value: any
  onHop: (value: any) => void
}

export type AdvancerType = 'pause' | 'choice' | 'finish'

export interface StoneUIConfig {
  fragment: string
  advancer: {
    type: AdvancerType
    params: any
  }
}

export interface StoneConsequences {
  assignTo: string | null // what name in the varmap to assign the value to
  flowFrom: Flocation
  newRiffle: boolean // should a new riffle be created after the stone is passed?
}

export interface Stone {
  ui: StoneUIConfig
  consequences: StoneConsequences
  value: any
}

export interface RiverStone {
  vars: VarMap // varmap at the time of stone creation
  stone: Stone
}

const WELCOME_STONE: RiverStone = {
  vars: Map(),
  stone: {
    ui: {
      fragment: 'Welcome to the river',
      advancer: {
        type: 'pause',
        params: {
          text: 'Begin',
        },
      },
    },
    consequences: {
      assignTo: null,
      flowFrom: {
        flow: 'flow-start',
        node: 0,
      },
      newRiffle: true,
    },
    value: null,
  },
}

export type Riffle = List<RiverStone>

const rewindAndApply = (
  state: RiverState,
  floem: DataFloem,
  riffleIdx: number,
  riverStoneIdx: number,
  value: any,
): RiverState => {
  const riffle = state.riffles.get(riffleIdx)!
  const riverStone = riffle.get(riverStoneIdx)!
  const { vars, stone } = riverStone
  const { flowFrom, assignTo, newRiffle } = stone.consequences
  const newVars = assignTo ? vars.set(assignTo, value) : vars
  const updatedRiverStone = {
    ...riverStone,
    stone: {
      ...stone,
      value,
    },
  }
  const updatedRiffle = riffle.set(riverStoneIdx, updatedRiverStone).slice(0, riverStoneIdx + 1)
  let updatedRiffles = state.riffles.set(riffleIdx, updatedRiffle).slice(0, riffleIdx + 1)
  if (newRiffle) {
    updatedRiffles = updatedRiffles.push(List())
  }
  const newRiverStone: RiverStone = riverStoneAt(floem, flowFrom, newVars)
  updatedRiffles = updatedRiffles.set(-1, updatedRiffles.get(-1)!.push(newRiverStone))
  return {
    riffles: updatedRiffles,
    activeRiffle: updatedRiffles.size - 1,
  }
}

const INITIAL_STATE = {
  riffles: List<Riffle>([List<RiverStone>([WELCOME_STONE])]),
  activeRiffle: 0,
}

type RiverState = typeof INITIAL_STATE

export const River = ({ floem }: RiverProps) => {
  const [state, setState] = useState({
    riffles: List<Riffle>([
      List<RiverStone>([riverStoneAt(floem, { flow: 'flow-start', node: 0 }, Map())]),
    ]),
    activeRiffle: 0,
  })
  const { riffles, activeRiffle } = state
  return (
    <div id='river' className=''>
      {riffles.map((riffle, i) => (
        <div
          id={'riffle ' + i}
          key={i}
          className='riffle overflow-hidden rounded-lg bg-white shadow m-5 p-5 flex flex-col'
        >
          {riffle.map((riverStone, j) => {
            const { ui, consequences, value } = riverStone.stone
            const { assignTo, flowFrom: flowTo, newRiffle } = consequences
            const active = i === activeRiffle && j === riffle.size - 1
            const onHop = (value: any) => {
              setState(rewindAndApply(state, floem, i, j, value))
            }
            const View = StoneView(ui)
            return <View active={active} value={value} onHop={onHop} key={j} />
          })}
        </div>
      ))}
    </div>
  )
}
