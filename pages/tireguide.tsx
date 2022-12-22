import { promises as fs } from 'fs'
import path from 'path'
import { Guide } from '../src/components/floem/guide/guide'
import { DataFloem, floemSchema } from '../src/model/replicache-spaces/ws-[id]/floem'

export const getStaticProps = async () => {
  const floem = floemSchema.parse(
    JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/floems/tireGuide.floem'), 'utf8')),
  )
  return { props: { floem } }
}

export default ({ floem }: { floem: DataFloem }) => {
  return <Guide floem={floem} />
}
