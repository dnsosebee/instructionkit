import { GetServerSideProps } from 'next'
import { spaceExists } from 'replicache-nextjs/lib/backend'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { FloemInjector } from '../../../../src/components/floem/floem'
import { Guide } from '../../../../src/components/floem/guide/guide'
import { floemMutators } from '../../../../src/model/replicache/space-workspace-[id]/mutators'

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context
  const { spaceId, floemId } = params as { floemId: string; spaceId: string }

  // Ensure the selected space exists. It's common during development for
  // developers to delete the backend database. As a convenience, we
  // automatically pick a new one when this occurs by redirecting back to the
  // root.
  if (!(await spaceExists(spaceId))) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      spaceId,
      floemId,
    },
  }
}

const PageRiver = ({ spaceId, floemId }: { spaceId: string; floemId: string }) => {
  const rep = useReplicache({ name: spaceId, mutators: floemMutators })
  if (!rep) {
    return null
  }
  return <FloemInjector rep={rep} id={floemId} view={Guide} />
}

export default PageRiver
