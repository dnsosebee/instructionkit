import { PlusCircleIcon, PlusIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSubscribe } from 'replicache-react'
import { Blink } from '../../src/components/loaders/blink'
import { useAppCtx } from '../../src/components/loaders/providers/appProvider'
import { useWorkspaceCtx } from '../../src/components/loaders/providers/workspaceProvider'
import { PROJECT_HREF } from '../../src/components/loaders/routeHandlers/projectHandler'
import { RootHandler } from '../../src/components/loaders/routeHandlers/rootHandler'
import { AppLayout } from '../../src/components/views/app/layout/appLayout'
import ContextMenu from '../../src/components/views/shared/contextMenu'
import { getRoute, setRoute } from '../../src/lib/route/route'
import { handleUploadFloem } from '../../src/model/persistence/filesystem'
import { listProjects } from '../../src/model/persistence/replicache/spaces/ws/entries/proj'
import { Project } from '../../src/model/schema/types/project'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  return {
    props: {
      workspaceId,
    },
  }
}

const WorkspacePage = ({ workspaceId }: { workspaceId: string }) => {
  setRoute({ route: `/${workspaceId}`, action: 'none' })
  return <RootHandler />
}

export default WorkspacePage

/**
 *
 */

export const WorkspaceView = () => {
  const { workspaceId } = getRoute().params
  const { userMembershipWorkspaces } = useAppCtx()
  const { workspaceRep, createProject } = useWorkspaceCtx()
  const projects = useSubscribe(workspaceRep, listProjects, [], [workspaceRep])
  const [creatingNew, setCreatingNew] = React.useState(false)
  const { workspace } = userMembershipWorkspaces.find(
    ({ workspace }) => workspace.id === workspaceId,
  )!
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length !== 1) {
      return
    }
    acceptedFiles.forEach(async file => {
      const floem = await handleUploadFloem(file)
      createProject(floem)
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true })
  const handleClickNewProject = async () => {
    setCreatingNew(true)
    await createProject()
    setCreatingNew(false)
  }

  const handleClickDelete = (projectId: string) => () => {
    workspaceRep.mutate.deleteProject(projectId)
  }

  return (
    <AppLayout>
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
          {projects.length > 0 ? (
            <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {projects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    workspaceId={workspaceId}
                    handleClickDelete={handleClickDelete(project.id)}
                  />
                ))}
                <NewProjectButton handleClickNewProject={handleClickNewProject} />
              </div>
            </div>
          ) : (
            <div className='text-center'>
              <PlusCircleIcon className='mx-auto h-12 w-12 text-gray-400' aria-hidden='true' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>No floems</h3>
              <p className='mt-1 text-sm text-gray-500'>Get started by creating a new floem.</p>
              <div className='mt-6'>
                <NewProjectButton handleClickNewProject={handleClickNewProject} />
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  )
}

function NewProjectButton({ handleClickNewProject }: { handleClickNewProject: () => void }) {
  return (
    <button
      type='button'
      onClick={handleClickNewProject}
      className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
    >
      <PlusIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
      New Floem
    </button>
  )
}

function ProjectCard({
  project,
  workspaceId,
  handleClickDelete,
}: {
  project: Project
  workspaceId: string
  handleClickDelete: () => void
}) {
  const date = new Date(project.createdAt)
  return (
    <div
      key={project.id}
      className='relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400'
    >
      {/* <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={floem.imageUrl} alt="" />
          </div> */}
      <div className='min-w-0 flex-1'>
        <Blink href={PROJECT_HREF(workspaceId, project.id)} className='focus:outline-none'>
          <span className='absolute inset-0' aria-hidden='true' />
          <p className='text-sm font-medium text-gray-900'>{project.title}</p>
          <p className='truncate text-sm text-gray-500'>
            {'created ' +
              (new Date().toLocaleDateString() === date.toLocaleDateString()
                ? date.toLocaleTimeString()
                : date.toLocaleDateString())}
          </p>
        </Blink>
      </div>
      <ContextMenu handleClickDelete={handleClickDelete} />
    </div>
  )
}
