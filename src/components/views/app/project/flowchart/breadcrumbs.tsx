import { motion } from 'framer-motion'
import { getRoute } from '../../../../../lib/route'
import { Blink } from '../../../../loaders/blink'
import { useAppCtx } from '../../../../loaders/providers/appProvider'
import { useWorkspaceCtx } from '../../../../loaders/providers/workspaceRepProvider'
import { TitleEditor } from '../shared/titleEditor'

export default function Breadcrumbs() {
  const { projectId, workspaceId } = getRoute().params
  const { appRep, userMembershipWorkspaces } = useAppCtx()
  const { projects, workspaceRep } = useWorkspaceCtx()
  const { workspace } = userMembershipWorkspaces.find(v => v.workspace.id === workspaceId)!
  const project = projects.find(v => v.id === projectId)!

  const handleUpdate = (updatedTitle: string) => {
    workspaceRep.mutate.updateProject({ id: projectId, title: updatedTitle })
  }

  return (
    <nav className='flex p-2 rounded-br-lg bg-white shadow' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-4'>
        <li key={'home'}>
          <div>
            <Blink href={`/app/${workspaceId}`} className='text-gray-400 hover:text-gray-500'>
              {/* an icon with /favicon.svg */}
              <motion.img
                src='/dark.svg'
                className='h-5 w-5 hover:-rotate-90 duration-200'
                alt=''
                // whileHover={{ transform: `rotate(-90)` }}
              />
              <span className='sr-only'>Home</span>
            </Blink>
          </div>
        </li>
        <li key={workspaceId}>
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
            <Blink href={`/app/${workspaceId}`} className='ml-3' aria-current={true}>
              <p className='text-sm font-medium text-gray-500 p-1'>{workspace.name}</p>
            </Blink>
          </div>
        </li>
        <li key={projectId}>
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
                className='text-sm font-medium text-gray-500 p-1'
                title={project.title}
                handleUpdate={handleUpdate}
              />
            </div>
          </div>
        </li>
      </ol>
    </nav>
  )
}
