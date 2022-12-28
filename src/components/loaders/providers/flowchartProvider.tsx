import { Map } from 'immutable'
import { createContext, useContext, useState } from 'react'
import { OnEdgesChange, OnNodesChange, ReactFlowProvider } from 'reactflow'
import { Dart } from '../../../model/replicache/spaces/proj/entries/dart/dart'
import { BranchFlow } from '../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { FlowchartEdge, FlowchartNode } from '../../views/app/project/flowchart/flowchart'

// note: some of this stuff is more context-y, some is more prop-y.
// I put it all together for clarity.
export type FlowchartContext = {
  flocus: string | null
  setFlocus: (flocus: string | null) => void
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  nodeSelections: Map<string, boolean>
  edgeSelections: Map<string, boolean>
  title: string
  handleNodesChange: OnNodesChange
  handleEdgesChange: OnEdgesChange
  addBranch: (branch: BranchFlow) => void
  // addSub
  // addRef
  // etc
  addDart: (dart: Dart) => void
  updateFlowtext: (id: string, type: string, flowtext: string) => void
  updateTitle: (title: string) => void
}

const flowchartContext = createContext<FlowchartContext | null>(null)

export interface FlowchartProviderProps {
  children: React.ReactNode
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  nodeSelections: Map<string, boolean>
  edgeSelections: Map<string, boolean>
  title: string
  handleNodesChange: OnNodesChange
  handleEdgesChange: OnEdgesChange
  addBranch: (branch: BranchFlow) => void
  addDart: (dart: Dart) => void
  updateFlowtext: (id: string, type: string, flowtext: string) => void
  updateTitle: (title: string) => void
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
