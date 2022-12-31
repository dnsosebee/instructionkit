import { createContext, useContext, useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { Dart } from '../../../model/replicache/spaces/proj/entries/dart/dart'
import { Flow, FlowUpdate } from '../../../model/replicache/spaces/proj/entries/flow/flow'

type FlowChangeEvent =
  | { action: 'createFlow'; flow: Flow }
  | { action: 'updateFlow'; update: FlowUpdate }
  | { action: 'deleteFlow'; id: string }

export type DartChangeEvent =
  | { action: 'createDart'; dart: Dart }
  | { action: 'deleteDart'; id: string }

export type TitleChangeEvent = { action: 'updateTitle'; title: string }

export type FloemChangeEvent = FlowChangeEvent | DartChangeEvent | TitleChangeEvent

export type SendFloemChange = (changes: FloemChangeEvent | FloemChangeEvent[]) => void

// note: some of this stuff is more context-y, some is more prop-y.
// I put it all together for clarity.
export type FlowchartContext = {
  flocus: string | null
  setFlocus: (flocus: string | null) => void
  flows: Flow[]
  darts: Dart[]
  title: string
  send: SendFloemChange
  previewHref: string
}

const flowchartContext = createContext<FlowchartContext | null>(null)

export interface FlowchartProviderProps {
  children: React.ReactNode
  flows: Flow[]
  darts: Dart[]
  title: string
  send: SendFloemChange
  previewHref: string
}

const FlowchartProvider = ({ children, ...value }: FlowchartProviderProps) => {
  const [flocus, setFlocus] = useState<FlowchartContext['flocus']>(null)
  return (
    <flowchartContext.Provider value={{ flocus, setFlocus, ...value }}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </flowchartContext.Provider>
  )
}

// calls useContext and throws a meaningful error if we're not within a flowchartProvider
export const useFlowchartCtx = () => {
  const context = useContext(flowchartContext)
  if (!context) {
    throw new Error('useFlowchartContext must be used within a FlowchartContext')
  }
  return context
}

export default FlowchartProvider
