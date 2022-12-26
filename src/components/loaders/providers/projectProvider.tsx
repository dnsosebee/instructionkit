import React from 'react'
import { ProjectRep, useProjectRep } from '../../../model/replicache/spaces/proj/projectMutators'
import Loading from '../../views/shared/loading'

export type ProjectContext = {
  projectRep: ProjectRep
}

export const projectContext = React.createContext<ProjectContext | null>(null)

export const useProjectCtx = () => {
  const ctx = React.useContext(projectContext)
  if (!ctx) {
    throw new Error('useProjectCtx must be used within a ProjectProvider')
  }
  return ctx
}

export const ProjectProvider = ({
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
  return <projectContext.Provider value={{ projectRep }}>{children}</projectContext.Provider>
}
