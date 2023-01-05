import React from 'react'
import { useSubscribe } from 'replicache-react'
import { initProject } from '../../../lib/route/actions'
import { createProjectSpaceHelper } from '../../../model/persistence/replicache/createSpace/createSpaceHelper'
import { listProjects } from '../../../model/persistence/replicache/spaces/ws/entries/proj'
import {
  useWorkspaceRep,
  WorkspaceRep,
} from '../../../model/persistence/replicache/spaces/ws/workspaceRep'
import { Floem } from '../../../model/schema/types/floem'
import { genProjectId, Project } from '../../../model/schema/types/project'

import Loading from '../../views/shared/loading'

export type WorkspaceContext = {
  workspaceRep: WorkspaceRep
  projects: Project[]
  createProject: (floem: Floem) => Promise<void>
}

export const workspaceContext = React.createContext<WorkspaceContext | null>(null)

export const useWorkspaceCtx = () => {
  const ctx = React.useContext(workspaceContext)
  if (!ctx) {
    throw new Error('useWorkspaceCtx must be used within a WorkspaceProvider')
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
  const createProject = async (floem: Floem) => {
    const projectId = genProjectId()
    const project: Project = {
      id: projectId,
      title: floem.title,
      createdAt: floem.createdAt,
    }
    await createProjectSpaceHelper({
      workspaceRep,
      workspaceId,
      project,
    })
    initProject(workspaceId, projectId, floem)
  }

  return (
    <workspaceContext.Provider value={{ workspaceRep, projects, createProject }}>
      {children}
    </workspaceContext.Provider>
  )
}
