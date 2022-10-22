import { PlusCircleIcon, PlusIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { useSubscribe } from 'replicache-react'
import { genFloemId, listFloems, STARTER_FLOEM } from '../../model/core/floem'
import { Rep } from '../../model/core/mutators'
import { spaceRelativeUrl } from '../floem/floem'
import { FloemCard } from './floemCard'

export const Dashboard = ({ rep }: { rep: Rep }) => {
  const floems = useSubscribe(rep, listFloems, [], [rep])

  const [creatingNew, setCreatingNew] = React.useState(false)

  const relativeUrl = spaceRelativeUrl(rep.name)

  const onClickNewFloemButton = () => {
    const id = genFloemId()
    setCreatingNew(true)
    rep.mutate.createFloem(STARTER_FLOEM(id))
    window.location.href = relativeUrl(`/chart/${id}`)
  }

  const mutate = { ...rep.mutate, spaceRelativeUrl: relativeUrl }

  return (
    <>
      <header className='bg-white shadow'>
        <div className='mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Dashboard</h1>
        </div>
      </header>
      <div className='pt-6 pb-8'>
        {creatingNew ? (
          <p>Creating Floem...</p>
        ) : floems.length > 0 ? (
          <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {floems.map(floem => (
                <FloemCard key={floem.id} floem={floem} mutate={mutate} />
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
