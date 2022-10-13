import { Mutate } from '../app'

interface StoneProps {
  mutate: Mutate
  flowtext: string
}

export const Stone = ({ mutate }: StoneProps) => {
  return (
    <div className='flex grow justify-center items-center bg-slate-900'>
      <div
        className='riffle prose min-w-[400px] m-4 p-6 shadow-2xl bg-white rounded'
        dangerouslySetInnerHTML={{ __html: flowtext }}
      ></div>
    </div>
  )
}
