import React from 'react'
import { useSubscribe } from 'replicache-react'
import { listDarts, RepDart } from '../../../model/replicache/spaces/proj/entries/dart/dart'
import { listFlows, RepFlow } from '../../../model/replicache/spaces/proj/entries/flow/flow'
import { ProjectRep, useProjectRep } from '../../../model/replicache/spaces/proj/projectMutators'
import Loading from '../../views/shared/loading'

export type ProjectContext = {
  projectRep: ProjectRep
  flows: RepFlow[]
  darts: RepDart[]
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
  const flows = useSubscribe(projectRep, listFlows, [], [projectRep])
  const darts = useSubscribe(projectRep, listDarts, [], [projectRep])
  if (!projectRep) {
    return <Loading />
  }
  return (
    <projectContext.Provider value={{ projectRep, flows, darts }}>
      {children}
    </projectContext.Provider>
  )
}
