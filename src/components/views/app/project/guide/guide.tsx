import { List, Map } from 'immutable'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { logger as parentLogger } from '../../../../../lib/logger'
import { Dart } from '../../../../../model/schema/types/dart/dart'
import { Flow } from '../../../../../model/schema/types/flow/flow'
import { START_FLOW_TYPE } from '../../../../../model/schema/types/flow/types/start'
import { riverStoneAt as guideStepAt, riverStoneAt } from './boat'
import { StoneView as StepView } from './stone'

const logger = parentLogger.child({ component: 'Guide' })

export interface GuideProps {
  flows: Flow[]
  darts: Dart[]
}

export type Booty = Map<string, any>

export interface Flocation {
  flow: Flow['id']
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
  flows: Flow[],
  darts: Dart[],
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
  const newGuideStep: GuideStep = await guideStepAt(flows, darts, flowFrom, newBooty, chosenCaseId)
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

export const Guide = ({ flows, darts }: GuideProps) => {
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
            await riverStoneAt(
              flows,
              darts,
              { flow: flows.find(v => v.type === START_FLOW_TYPE)!.id, node: 0 },
              Map([[`output`, null]]),
            ),
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
      <Script src='/iframeSizer.contentWindow.min.js' />
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
                setState(await rewindAndApply(state, flows, darts, i, j, value, chosenCaseId))
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
    </div>
  )
}
