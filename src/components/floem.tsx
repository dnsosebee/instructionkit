import { useSubscribe } from 'replicache-react'
import { listFloems } from '../model/core/floem'
import { Mutate, Rep } from '../model/core/mutators'
import { Chart } from './chart/chart'

export interface Mutates {
  mutate: Mutate
}

export const spaceRelativeUrl = (spaceId: string) => (path: string) => `/space/${spaceId}/${path}`

export const Floem = ({ rep, id }: { rep: Rep; id: string }) => {
  const floem = useSubscribe(rep, listFloems, []).find(f => f.id === id)
  if (!floem) {
    return null
  }
  return (
    <Chart
      mutate={{ ...rep.mutate, spaceRelativeUrl: spaceRelativeUrl(rep.name) }}
      floem={floem}
      startFlowing={() => null}
    />
  )
}
