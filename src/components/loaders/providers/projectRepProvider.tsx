import React from 'react'
import { ProjectRep, useProjectRep } from '../../../model/replicache/spaces/proj/projectMutators'
import Loading from '../../views/shared/loading'

export type ProjectRepContext = {
  projectRep: ProjectRep
}

export const projectRepContext = React.createContext<ProjectRepContext | null>(null)

export const useProjectRepCtx = () => {
  const ctx = React.useContext(projectRepContext)
  if (!ctx) {
    throw new Error('useWorkspaceRepCtx must be used within a WorkspaceRepProvider')
  }
  return ctx
}

export const ProjectRepProvider = ({
  children,
  workspaceId,
  projectId,
}: {
  children: React.ReactNode
  workspaceId: string
  projectId: string
}) => {
  const projectRep = useProjectRep(workspaceId, projectId)
  if (!projectRep) {
    return <Loading />
  }
  return <projectRepContext.Provider value={{ projectRep }}>{children}</projectRepContext.Provider>
}
