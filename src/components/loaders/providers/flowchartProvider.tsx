import { createContext, useContext, useState } from 'react'
import { OnEdgesChange, OnNodesChange } from 'reactflow'
import { RepDart } from '../../../model/replicache/spaces/proj/entries/dart/dart'
import { RepBranch } from '../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { FlowchartEdge, FlowchartNode } from '../../views/app/project/flowchart/flowchart'

export type FlowchartContext = {
  flocus: string | null
  setFlocus: (flocus: string | null) => void
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  handleNodesChange: OnNodesChange
  handleEdgesChange: OnEdgesChange
  addBranch: (branch: RepBranch) => void
  // addSub
  // addRef
  addDart: (dart: RepDart) => void
  updateFlowtext: (flowId: string, text: string) => void
}

const flowchartContext = createContext<FlowchartContext | null>(null)

export interface FlowchartProviderProps {
  children: React.ReactNode
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  handleNodesChange: OnNodesChange
  handleEdgesChange: OnEdgesChange
  addBranch: (branch: RepBranch) => void
  addDart: (dart: RepDart) => void
  updateFlowtext: (flowId: string, text: string) => void
}
const FlowchartProvider = ({ children, ...value }: FlowchartProviderProps) => {
  const [flocus, setFlocus] = useState<FlowchartContext['flocus']>(null)
  return (
    <flowchartContext.Provider value={{ flocus, setFlocus, ...value }}>
      {children}
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
