import { useSubscribe } from 'replicache-react'
import { DataFloem, listFloems } from '../../model/replicache-spaces/workspace-[id]/floem'
import { Mutate, Rep } from '../../model/replicache-spaces/workspace-[id]/mutators'

export const spaceRelativeUrl = (spaceId: string) => (path: string) => `/space/${spaceId}/${path}`

interface FloemInjectorProps {
  rep: Rep
  id: string
  view: React.FC<{ floem: DataFloem; mutate: Mutate }>
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
