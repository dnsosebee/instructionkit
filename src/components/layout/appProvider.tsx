import { User } from '@supabase/auth-helpers-nextjs'
import { createContext, useContext } from 'react'
import { AppRep } from '../../model/replicache/space-app/appMutators'
import { RepInvite } from '../../model/replicache/space-app/invite'
import { RepWorkspace } from '../../model/replicache/space-app/workspace'

export type AppContext = {
  selectedWorkspace: RepWorkspace
  memberStatus: {
    // accessPolicy: 'owner' | 'member'
    acceptedInvite: boolean
  }
  appRep: AppRep
  user: User
  userInvites: RepInvite[]
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
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export default AppProvider
