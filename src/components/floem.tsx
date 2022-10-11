import { useSubscribe } from 'replicache-react'
import { listFloems } from '../model/core/floem'
import { Chart } from './chart/chart'
import { Rep } from './dashboard'

export const Floem = ({ rep, id }: { rep: Rep; id: string }) => {
  const floem = useSubscribe(rep, listFloems, []).find(f => f.id === id)
  if (!floem) {
    return <div>Not found</div>
  }
  return <Chart mutate={rep.mutate} floem={floem} startFlowing={() => null} />
}
