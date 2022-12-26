import React from 'react'
import { useSubscribe } from 'replicache-react'
import { createProjectRepHelper } from '../../../model/replicache/createRepHelper'
import {
  genProjectId,
  listProjects,
  RepProject,
} from '../../../model/replicache/spaces/ws/entries/proj'
import {
  useWorkspaceRep,
  WorkspaceRep,
} from '../../../model/replicache/spaces/ws/workspaceMutators'
import Loading from '../../views/shared/loading'

export type WorkspaceContext = {
  workspaceRep: WorkspaceRep
  projects: RepProject[]
  createProject: () => Promise<string>
}

export const workspaceContext = React.createContext<WorkspaceContext | null>(null)

export const useWorkspaceCtx = () => {
  const ctx = React.useContext(workspaceContext)
  if (!ctx) {
    throw new Error('useWorkspaceRepCtx must be used within a WorkspaceRepProvider')
  }
  return ctx
}

export const WorkspaceProvider = ({
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
    <InnerWorkspaceProvider workspaceId={workspaceId} workspaceRep={workspaceRep}>
      {children}
    </InnerWorkspaceProvider>
  )
}

const InnerWorkspaceProvider = ({
  children,
  workspaceRep,
  workspaceId,
}: {
  children: React.ReactNode
  workspaceRep: WorkspaceRep
  workspaceId: string
}) => {
  const projects = useSubscribe(workspaceRep, listProjects, null, [workspaceRep])
  if (!projects) {
    return <Loading />
  }
  const createProject = async () => {
    const projectId = genProjectId()
    await createProjectRepHelper({
      workspaceRep,
      workspaceId,
      projectId,
    })
    return projectId
  }

  return (
    <workspaceContext.Provider value={{ workspaceRep, projects, createProject }}>
      {children}
    </workspaceContext.Provider>
  )
}
