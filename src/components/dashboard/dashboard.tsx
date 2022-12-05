import { PlusCircleIcon, PlusIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSubscribe } from 'replicache-react'
import { logger } from '../../logger'
import { handleUploadFloem } from '../../model/filesystem/filesystem'
import { RepWorkspace } from '../../model/replicache-spaces/app/types/workspace'
import { listFloems, STARTER_FLOEM } from '../../model/replicache-spaces/ws-[id]/floem'
import { genFloemId } from '../../model/replicache-spaces/ws-[id]/ids'
import { WorkspaceRep } from '../../model/replicache-spaces/ws-[id]/workspaceMutators'
import { spaceRelativeUrl } from '../floem/floem'
import { useAppContext } from '../layout/appProvider'
import { redirectTo } from '../shared/redirect'
import { FloemCard } from './floemCard'

export const Dashboard = ({ rep }: { rep: WorkspaceRep }) => {
  let workspace: RepWorkspace | null = null
  try {
    workspace = useAppContext().workspace
  } catch (e) {
    logger.debug('Dashboard: no workspace context')
  }
  const floems = useSubscribe(rep, listFloems, [], [rep])

  const [creatingNew, setCreatingNew] = React.useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return
    }
    acceptedFiles.forEach(async file => {
      const floemId = genFloemId()
      const floem = await handleUploadFloem(file)
      mutate.createFloem({ ...floem, id: floemId })
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true })

  const relativeUrl = spaceRelativeUrl(rep.name)

  const onClickNewFloemButton = async () => {
    const id = genFloemId()
    setCreatingNew(true)
    await rep.mutate.createFloem(STARTER_FLOEM(id))
    if (workspace) {
      redirectTo(`/app/${workspace.id}/${id}`)
    } else {
      return redirectTo(`/space/${rep.name}/chart/${id}`)
    }
  }

  const mutate = { ...rep.mutate, spaceRelativeUrl: relativeUrl }

  return (
    <>
      <header className=' shadow'>
        <div className='mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold tracking-tight text-indigo-100'>
            <span className='text-indigo-400'>{workspace?.name}</span> Dashboard
          </h1>
        </div>
      </header>
      {creatingNew ? (
        <p className='pt-6 pb-8'>Creating Floem...</p>
      ) : (
        <div
          {...getRootProps()}
          className={classNames(
            isDragActive ? 'rounded-lg border-2 border-dashed border-gray-300' : '',
            'pt-6 pb-8',
          )}
        >
          <input {...getInputProps()} />
          {floems.length > 0 ? (
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
      )}
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
