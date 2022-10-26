import { createContext, useContext } from 'react'
import { AdvancerProps } from './guide/guide'

export enum View {
  Guide,
  Flowchart,
}

export type FlowtextContext<T extends View> = { view: T } & (T extends View.Guide
  ? {
      onHop: AdvancerProps['onHop']
      chosenCaseId: string | undefined
    }
  : T extends View.Flowchart
  ? {
      dartCases: string[]
    }
  : never)

type FlowtextContextValue = FlowtextContext<View.Guide> | FlowtextContext<View.Flowchart>

const flowtextContext = createContext<FlowtextContextValue | null>(null)

export interface FlowtextProviderProps {
  children: JSX.Element
  context: FlowtextContextValue
}
const FlowtextProvider = ({ children, context }: FlowtextProviderProps) => {
  return <flowtextContext.Provider value={context}>{children}</flowtextContext.Provider>
}

// calls useContext and throws a meaningful error if we're not within a flowtextprovider
export const useFlowtextContext = () => {
  const context = useContext(flowtextContext)
  if (!context) {
    throw new Error('useFlowtextContext must be used within a FlowtextProvider')
  }
  return context
}

export default FlowtextProvider
