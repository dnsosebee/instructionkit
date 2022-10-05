import { GetServerSideProps } from 'next'
import { spaceExists } from 'replicache-nextjs/lib/backend'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import App from '../../../src/components/app'
import { floemMutators } from '../../../src/model/core/mutators'

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context
  const { listID } = params as { listID: string }

  // Ensure the selected space exists. It's common during development for
  // developers to delete the backend database. As a convenience, we
  // automatically pick a new one when this occurs by redirecting back to the
  // root.
  if (!(await spaceExists(listID))) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      listID,
    },
  }
}

export default function Home({ listID }: { listID: string }) {
  // Load the space "listID"
  const rep = useReplicache({ name: listID, mutators: floemMutators })
  if (!rep) {
    return null
  }

  return (
    <div className='w-full'>
      <App rep={rep} listID={listID} />
    </div>
  )
}
