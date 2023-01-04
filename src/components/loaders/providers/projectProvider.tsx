import React from 'react'
import { useSubscribe } from 'replicache-react'
import { listDarts } from '../../../model/persistence/replicache/spaces/proj/entries/darts'
import { listFlows } from '../../../model/persistence/replicache/spaces/proj/entries/flow'
import {
  ProjectRep,
  useProjectRep,
} from '../../../model/persistence/replicache/spaces/proj/projectRep'
import { Dart } from '../../../model/schema/types/dart/dart'
import { genDefaultFloem } from '../../../model/schema/types/floem'
import { Flow } from '../../../model/schema/types/flow/flow'

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
