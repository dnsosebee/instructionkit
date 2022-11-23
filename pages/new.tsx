import { nanoid } from 'nanoid'
import { GetServerSideProps } from 'next'
import { createSpace } from 'replicache-nextjs/lib/backend'

function Page() {
  return ''
}

export const getServerSideProps: GetServerSideProps = async () => {
  const spaceId = nanoid(6)
  await createSpace(spaceId)
  return {
    redirect: {
      destination: `/space/${spaceId}`,
      permanent: false,
    },
  }
}

export default Page
