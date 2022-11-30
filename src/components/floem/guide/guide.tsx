import { List, Map } from 'immutable'
import { useEffect, useState } from 'react'
import { logger } from '../../../logger'
import { DataFloem } from '../../../model/replicache-spaces/workspace-[id]/floem'
import { DataFlow } from '../../../model/replicache-spaces/workspace-[id]/flow'
import { FLOW_START_ID } from '../../../model/replicache-spaces/workspace-[id]/ids'
import { Mutate } from '../../../model/replicache-spaces/workspace-[id]/mutators'
import { riverStoneAt as guideStepAt } from './boat'
import { StoneView as StepView } from './stone'

export interface GuideProps {
  mutate: Mutate
  floem: DataFloem
}

export type Booty = Map<string, any>

export interface Flocation {
  flow: DataFlow['id']
  node: number
}

export interface AdvancerProps {
  active: boolean
  value: any
  onHop: (value: any, chosenCaseId?: string) => void
}

export type AdvancerType = 'pause' | 'choice' | 'finish' | 'string' | 'int' | 'float'

export interface StepUIConfig {
  fragment: string
  advancer: {
    type: AdvancerType
    params: any
  }
}

export interface StepConsequences {
  assignTo: string | null // what name in the booty to assign the value to
  flowFrom: Flocation
  newPage: boolean // should a new page be created after the stone is passed?
}

export interface Step {
  ui: StepUIConfig
  consequences: StepConsequences
  value: any
}

export interface GuideStep {
  booty: Booty // booty at the time of stone creation
  step: Step
}

export type GuidePage = List<GuideStep>

const rewindAndApply = async (
  state: GuideState,
  floem: DataFloem,
  pageNumber: number,
  stepNumber: number,
  value: any,
  chosenCaseId?: string,
): Promise<GuideState> => {
  logger.debug('rewindAndApply', { pageNumber, stepNumber, value })
  const guidePage = state.pages.get(pageNumber)!
  const guideStep = guidePage.get(stepNumber)!
  const { booty, step } = guideStep
  const { flowFrom, assignTo, newPage: newPage } = step.consequences
  const newBooty = assignTo ? booty.set(assignTo, value) : booty
  const updatedGuideStep = {
    ...guideStep,
    step: {
      ...step,
      value,
    },
  }
  const updatedGuidePage = guidePage.set(stepNumber, updatedGuideStep).slice(0, stepNumber + 1)
  let updatedPages = state.pages.set(pageNumber, updatedGuidePage).slice(0, pageNumber + 1)
  if (newPage) {
    updatedPages = updatedPages.push(List())
  }
  const newGuideStep: GuideStep = await guideStepAt(floem, flowFrom, newBooty, chosenCaseId)
  updatedPages = updatedPages.set(-1, updatedPages.get(-1)!.push(newGuideStep))
  return {
    pages: updatedPages,
    activePage: updatedPages.size - 1,
  }
}

type GuideState = {
  pages: List<GuidePage>
  activePage: number
}

export const Guide = ({ floem }: GuideProps) => {
  const [state, setState] = useState({
    pages: List<GuidePage>([List<GuideStep>([])]),
    activePage: 0,
  })
  useEffect(() => {
    const getFirst = async () => {
      setState({
        activePage: 0,
        pages: List([
          List([
            await guideStepAt(floem, { flow: FLOW_START_ID, node: 0 }, Map([[`output`, null]])),
          ]),
        ]),
      })
    }
    getFirst()
  }, [])
  const { pages, activePage } = state

  return (
    <div
      id='guide'
      className=' bg-slate-900 grow flex flex-col items-center p-2 min-h-full min-w-full'
    >
      {/* reversed so that new elements transition in smoothly at the bottom (at least, sometimes they do) */}
      <div className='flex flex-col-reverse overflow-auto'>
        <div className='flex flex-col'>
          {pages.map((page, i) => (
            <div
              id={'page ' + i}
              key={i}
              className='guide-page overflow-hidden rounded-lg shadow my-5 p-5 flex flex-col prose-2xl text-white prose-headings:font-bold prose-h1:text-9xl prose-h2:text-7xl prose-h3:text-5xl prose-h4:text-3xl'
            >
              {page.map((step, j) => {
                const { ui, value } = step.step
                const active = i === activePage && j === page.size - 1
                const onHop = async (value: any, chosenCaseId?: string) => {
                  setState(await rewindAndApply(state, floem, i, j, value, chosenCaseId))
                }
                return (
                  <StepView
                    uiConfig={ui}
                    advancerProps={{ active, value, onHop }}
                    key={`r ${i} s ${j} f ${step.step.consequences.flowFrom.flow}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
        {/* <div className='text-3xl text-white mt-3 font-bold tracking-tight text-gray-50'>
          {floem.title}
        </div> */}
      </div>
    </div>
  )
}
