import { List, Map } from 'immutable'
import { useEffect, useState } from 'react'
import { logger } from '../../logger'
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

export type AdvancerType = 'pause' | 'choice' | 'finish' | 'string' | 'int' | 'float'

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

export type Riffle = List<RiverStone>

const rewindAndApply = async (
  state: RiverState,
  floem: DataFloem,
  riffleIdx: number,
  riverStoneIdx: number,
  value: any,
): Promise<RiverState> => {
  logger.debug('rewindAndApply', { riffleIdx, riverStoneIdx, value })
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
  const newRiverStone: RiverStone = await riverStoneAt(floem, flowFrom, newVars)
  updatedRiffles = updatedRiffles.set(-1, updatedRiffles.get(-1)!.push(newRiverStone))
  return {
    riffles: updatedRiffles,
    activeRiffle: updatedRiffles.size - 1,
  }
}

type RiverState = {
  riffles: List<Riffle>
  activeRiffle: number
}

export const River = ({ floem }: RiverProps) => {
  logger.debug('River', { floem })
  console.log('floem', floem)
  const [state, setState] = useState({
    riffles: List<Riffle>([List<RiverStone>([])]),
    activeRiffle: 0,
  })
  useEffect(() => {
    const getFirst = async () => {
      setState({
        activeRiffle: 0,
        riffles: List([
          List([
            await riverStoneAt(floem, { flow: 'flow-start', node: 0 }, Map([[`output`, null]])),
          ]),
        ]),
      })
    }
    getFirst()
  }, [])
  const { riffles, activeRiffle } = state

  return (
    <div
      id='river'
      className='absolute bg-slate-900 grow flex flex-col items-center p-2 min-h-full min-w-full'
    >
      <div className=''>
        <div className='text-3xl text-white mt-3 font-bold tracking-tight text-gray-50'>
          {floem.title}
        </div>
        {riffles.map((riffle, i) => (
          <div
            id={'riffle ' + i}
            key={i}
            className='riffle overflow-hidden rounded-lg bg-white shadow my-5 p-5 flex flex-col'
          >
            {riffle.map((riverStone, j) => {
              const { ui, value } = riverStone.stone
              const active = i === activeRiffle && j === riffle.size - 1
              const onHop = async (value: any) => {
                setState(await rewindAndApply(state, floem, i, j, value))
              }
              return (
                <StoneView
                  uiConfig={ui}
                  advancerProps={{ active, value, onHop }}
                  key={`r ${i} s ${j}`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
