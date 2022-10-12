import Link from 'next/link'
import { DataFloem } from '../model/core/floem'
import { Mutate } from '../model/core/mutators'
import ContextMenu from './contextMenu'

export interface FloemCardProps {
  floem: DataFloem
  mutate: Mutate
}

export const FloemCard = ({ floem, mutate }: FloemCardProps) => {
  const date = new Date(floem.createdAt)
  return (
    <div
      key={floem.id}
      className='relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400'
    >
      {/* <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={floem.imageUrl} alt="" />
          </div> */}
      <div className='min-w-0 flex-1'>
        <Link href={mutate.spaceRelativeUrl(`/chart/${floem.id}`)}>
          <a className='focus:outline-none'>
            <span className='absolute inset-0' aria-hidden='true' />
            <p className='text-sm font-medium text-gray-900'>{floem.title}</p>
            <p className='truncate text-sm text-gray-500'>
              {'created ' +
                (new Date().toLocaleDateString() === date.toLocaleDateString()
                  ? date.toLocaleTimeString()
                  : date.toLocaleDateString())}
            </p>
          </a>
        </Link>
      </div>
      <ContextMenu onClickDeleteButton={() => mutate.deleteFloem(floem.id)} />
    </div>
  )
}
