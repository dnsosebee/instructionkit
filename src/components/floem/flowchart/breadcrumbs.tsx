import { motion } from 'framer-motion'
import Link from 'next/link'
import { DataFloem } from '../../../model/replicache-spaces/ws-[id]/floem'
import { WorkspaceMutate } from '../../../model/replicache-spaces/ws-[id]/workspaceMutators'
import { TitleEditor } from './titleEditor'

export interface BreadcrumbsProps {
  floem: DataFloem
  mutate: WorkspaceMutate
}

export default function Breadcrumbs({ floem, mutate }: BreadcrumbsProps) {
  return (
    <nav className='flex p-2 rounded-br-lg bg-white shadow' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-4'>
        <li>
          <div>
            <Link href={mutate.spaceRelativeUrl('')} className='text-gray-400 hover:text-gray-500'>
              {/* an icon with /favicon.svg */}
              <motion.img
                src='/dark.svg'
                className='h-5 w-5 hover:-rotate-90 duration-200'
                alt=''
                // whileHover={{ transform: `rotate(-90)` }}
              />
              <span className='sr-only'>Home</span>
            </Link>
          </div>
        </li>
        <li key={floem.id}>
          <div className='flex items-center'>
            <svg
              className='h-5 w-5 flex-shrink-0 text-gray-300'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
              aria-hidden='true'
            >
              <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
            </svg>
            <div className='ml-3' aria-current={true}>
              <TitleEditor
                mutate={mutate}
                floem={floem}
                classNames='text-sm font-medium text-gray-500 p-1'
              />
            </div>
          </div>
        </li>
      </ol>
    </nav>
  )
}
