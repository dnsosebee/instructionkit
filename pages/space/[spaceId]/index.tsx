import { GetServerSideProps } from 'next'
import { spaceExists } from 'replicache-nextjs/lib/backend'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { Dashboard } from '../../../src/components/dashboard'
import { floemMutators } from '../../../src/model/core/mutators'

export const ensureSpaceExists: GetServerSideProps = async context => {
  const { params } = context
  const { spaceId } = params as { spaceId: string }

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
    },
  }
}

export const getServerSideProps = ensureSpaceExists

export default ({ spaceId }: { spaceId: string }) => {
  const rep = useReplicache({ name: spaceId, mutators: floemMutators })
  if (!rep) {
    return null
  }

  return (
    <div className='w-full'>
      <Dashboard rep={rep} />
    </div>
  )
}
