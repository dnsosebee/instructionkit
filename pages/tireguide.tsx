import { promises as fs } from 'fs'
import path from 'path'
import { Guide } from '../src/components/views/app/project/guide/guide'
import { Floem, floemSchema } from '../src/model/schema/types/floem'

export const getStaticProps = async () => {
  const floem = floemSchema.parse(
    JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/floems/tireGuide.floem'), 'utf8')),
  )
  return { props: { floem } }
}

export default ({ floem }: { floem: Floem }) => {
  return <Guide flows={floem.flows} darts={floem.darts} />
}
