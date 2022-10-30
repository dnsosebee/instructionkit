import { createContext, useContext, useState } from 'react'

export type FlowchartContext = {
  flocus: string | null
  setFlocus: (flocus: string | null) => void
}

const flowchartContext = createContext<FlowchartContext | null>(null)

export interface FlowchartProviderProps {
  children: JSX.Element
}
const FlowchartProvider = ({ children }: FlowchartProviderProps) => {
  const [flocus, setFlocus] = useState<FlowchartContext['flocus']>(null)
  return (
    <flowchartContext.Provider value={{ flocus, setFlocus }}>{children}</flowchartContext.Provider>
  )
}

// calls useContext and throws a meaningful error if we're not within a flowchartProvider
export const useFlowchartContext = () => {
  const context = useContext(flowchartContext)
  if (!context) {
    throw new Error('useFlowchartContext must be used within a FlowchartContext')
  }
  return context
}

export default FlowchartProvider
