import React from 'react'
import { useSubscribe } from 'replicache-react'
import { Dart, listDarts } from '../../../model/replicache/spaces/proj/entries/dart/dart'
import { Flow, listFlows } from '../../../model/replicache/spaces/proj/entries/flow/flow'
import { ProjectRep, useProjectRep } from '../../../model/replicache/spaces/proj/projectMutators'
import { genDefaultFloem } from '../../../model/url/floem'
import Loading from '../../views/shared/loading'

export type ProjectContext = {
  projectRep: ProjectRep
  flows: Flow[]
  darts: Dart[]
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
  const flows = useSubscribe(projectRep, listFlows, null, [projectRep])
  const darts = useSubscribe(projectRep, listDarts, null, [projectRep])
  if (!projectRep || !flows || !darts) {
    return <Loading />
  }
  if (flows.length === 0) {
    projectRep.mutate.reset(genDefaultFloem())
  }
  return (
    <projectContext.Provider value={{ projectRep, flows, darts }}>
      {children}
    </projectContext.Provider>
  )
}
