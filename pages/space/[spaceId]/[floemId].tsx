import { GetServerSideProps } from 'next'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { useSubscribe } from 'replicache-react'
import { ensureSpaceExists } from '.'
import { Chart } from '../../../src/components/chart/chart'
import { listFloems } from '../../../src/model/core/floem'
import { floemMutators } from '../../../src/model/core/mutators'

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context
  const { floemId } = params as { floemId: string }
  return { ...ensureSpaceExists(context), floemId }
}

export default ({ spaceId, floemId }: { spaceId: string; floemId: string }) => {
  const rep = useReplicache({ name: spaceId, mutators: floemMutators })
  if (!rep) {
    return null
  }
  const floem = useSubscribe(rep, listFloems, []).find(f => f.id === floemId)
  if (!floem) {
    return <div>Not found</div>
  }
  return <Chart mutate={rep.mutate} floem={floem} startFlowing={() => null} />
}
