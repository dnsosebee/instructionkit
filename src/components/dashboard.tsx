import { PlusCircleIcon, PlusIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useState } from 'react'
import { Replicache } from 'replicache'
import { useSubscribe } from 'replicache-react'
import { genDummyFloem, genDummyFloemId } from '../model/core/data/dummyFloem'
import { listFloems } from '../model/core/floem'
import { M } from '../model/core/mutators'
import ContextMenu from './contextMenu'

export type Rep = Replicache<M>

export const Dashboard = ({ rep }: { rep: Rep }) => {
  const floems = useSubscribe(rep, listFloems, [], [rep])
  const [creatingNew, setCreatingNew] = useState(false)

  const onClickNewFloemButton = () => {
    const id = genDummyFloemId()
    setCreatingNew(true)
    rep.mutate.createFloem(genDummyFloem(id))
    window.location.href = `/space/${rep.name}/${id}`
  }

  return (
    <>
      <header className='bg-white shadow'>
        <div className='mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Dashboard</h1>
        </div>
      </header>
      <div className='pt-6 pb-8'>
        {floems.length > 0 && !creatingNew ? (
          <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {floems.map(floem => (
                <div
                  key={floem.id}
                  className='relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400'
                >
                  {/* <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={floem.imageUrl} alt="" />
          </div> */}
                  <div className='min-w-0 flex-1'>
                    <Link href={`/space/${rep.name}/${floem.id}`}>
                      <a className='focus:outline-none'>
                        <span className='absolute inset-0' aria-hidden='true' />
                        <p className='text-sm font-medium text-gray-900'>{floem.title}</p>
                        <p className='truncate text-sm text-gray-500'>
                          {floem.createdAt.toString()}
                        </p>
                      </a>
                    </Link>
                  </div>
                  <ContextMenu onClickDeleteButton={() => rep.mutate.deleteFloem(floem.id)} />
                </div>
              ))}
              <NewFloemButton onClickNewFloemButton={onClickNewFloemButton} />
            </div>
          </div>
        ) : (
          <div className='text-center'>
            <PlusCircleIcon className='mx-auto h-12 w-12 text-gray-400' aria-hidden='true' />
            <h3 className='mt-2 text-sm font-medium text-gray-900'>No floems</h3>
            <p className='mt-1 text-sm text-gray-500'>Get started by creating a new floem.</p>
            <div className='mt-6'>
              <NewFloemButton onClickNewFloemButton={onClickNewFloemButton} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function NewFloemButton({ onClickNewFloemButton }: { onClickNewFloemButton: () => void }) {
  return (
    <button
      type='button'
      onClick={onClickNewFloemButton}
      className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
    >
      <PlusIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
      New Floem
    </button>
  )
}
