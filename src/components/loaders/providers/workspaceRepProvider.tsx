import React from 'react'
import { useSubscribe } from 'replicache-react'
import { listProjects, RepProject } from '../../../model/replicache/spaces/ws-[id]/entries/proj'
import {
  useWorkspaceRep,
  WorkspaceRep,
} from '../../../model/replicache/spaces/ws-[id]/workspaceMutators'
import Loading from '../../shared/loading'

export type WorkspaceRepContext = {
  workspaceRep: WorkspaceRep
  projects: RepProject[]
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
    <InnerWorkspaceRepProvider workspaceRep={workspaceRep}>{children}</InnerWorkspaceRepProvider>
  )
}

const InnerWorkspaceRepProvider = ({
  children,
  workspaceRep,
}: {
  children: React.ReactNode
  workspaceRep: WorkspaceRep
}) => {
  const projects = useSubscribe(workspaceRep, listProjects, null, [workspaceRep])
  if (!projects) {
    return <Loading />
  }
  return (
    <workspaceRepContext.Provider value={{ workspaceRep, projects }}>
      {children}
    </workspaceRepContext.Provider>
  )
}
