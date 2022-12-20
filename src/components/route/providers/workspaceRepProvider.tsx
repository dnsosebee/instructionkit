import React from 'react'
import {
  useWorkspaceRep,
  WorkspaceRep,
} from '../../../model/replicache/spaces/ws-[id]/workspaceMutators'
import Loading from '../../shared/loading'

export type WorkspaceRepContext = {
  workspaceRep: WorkspaceRep
}

export const workspaceRepContext = React.createContext<WorkspaceRepContext | null>(null)

export const useWorkspaceRepCtx = () => {
  const ctx = React.useContext(workspaceRepContext)
  if (!ctx) {
    throw new Error('useWorkspaceRepCtx must be used within a WorkspaceRepProvider')
  }
  return ctx
}

export const WorkspaceRepProvider = ({
  children,
  workspaceId,
}: {
  children: React.ReactNode
  workspaceId: string
}) => {
  const workspaceRep = useWorkspaceRep(workspaceId)
  if (!workspaceRep) {
    return <Loading />
  }
  return (
    <workspaceRepContext.Provider value={{ workspaceRep }}>{children}</workspaceRepContext.Provider>
  )
}
