import React from 'react'
import { useSubscribe } from 'replicache-react'
import { createProjectRepHelper } from '../../../model/replicache/createRepHelper'
import {
  genProjectId,
  listProjects,
  RepProject,
} from '../../../model/replicache/spaces/ws-[id]/entries/proj'
import {
  useWorkspaceRep,
  WorkspaceRep,
} from '../../../model/replicache/spaces/ws-[id]/workspaceMutators'
import Loading from '../../views/shared/loading'

export type WorkspaceRepContext = {
  workspaceRep: WorkspaceRep
  projects: RepProject[]
  createProject: () => Promise<string>
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
    <InnerWorkspaceRepProvider workspaceId={workspaceId} workspaceRep={workspaceRep}>
      {children}
    </InnerWorkspaceRepProvider>
  )
}

const InnerWorkspaceRepProvider = ({
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
    <workspaceRepContext.Provider value={{ workspaceRep, projects, createProject }}>
      {children}
    </workspaceRepContext.Provider>
  )
}
