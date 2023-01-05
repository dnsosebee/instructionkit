import { createContext, useContext, useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { SendFloemChange } from '../../../model/persistence/shared/floemChangeEvent'
import { Dart } from '../../../model/schema/types/dart/dart'
import { Flow } from '../../../model/schema/types/flow/flow'

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
