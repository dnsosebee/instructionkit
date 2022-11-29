import { createContext, useContext } from 'react'
import { AppMutate } from '../../model/replicache/space-app/appMutators'
import { RepWorkspace } from '../../model/replicache/space-app/workspace'

export type AppContext = {
  selectedWorkspace: RepWorkspace
  appMutate: AppMutate
}

const appContext = createContext<AppContext | null>(null)

export interface AppProviderProps {
  children: React.ReactNode
  context: AppContext
}
const AppProvider = ({ children, context }: AppProviderProps) => {
  return <appContext.Provider value={context}>{children}</appContext.Provider>
}

// calls useContext and throws a meaningful error if we're not within a flowtextprovider
export const useAppContext = () => {
  const context = useContext(appContext)
  if (!context) {
    throw new Error('useFlowtextContext must be used within a FlowtextProvider')
  }
  return context
}

export default AppProvider
