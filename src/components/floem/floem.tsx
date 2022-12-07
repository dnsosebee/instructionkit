import { useSubscribe } from 'replicache-react'
import { DataFloem, listFloems } from '../../model/replicache-spaces/ws-[id]/keys/floem/floem'
import {
  WorkspaceMutate,
  WorkspaceRep,
} from '../../model/replicache-spaces/ws-[id]/workspaceMutators'

export const spaceRelativeUrl = (spaceId: string) => (path: string) => `/space/${spaceId}${path}`

interface FloemInjectorProps {
  rep: WorkspaceRep
  id: string
  view: React.FC<{ floem: DataFloem; mutate: WorkspaceMutate }>
}

export const FloemInjector = ({ rep, id, view: View }: FloemInjectorProps) => {
  const floem = useSubscribe(rep, listFloems, []).find(f => f.id === id)
  if (!floem) {
    return null
  }
  return (
    <View mutate={{ ...rep.mutate, spaceRelativeUrl: spaceRelativeUrl(rep.name) }} floem={floem} />
  )
}
