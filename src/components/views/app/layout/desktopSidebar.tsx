import { FolderPlusIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { getRoute } from '../../../../lib/route'
import { Blink } from '../../../loaders/blink'
import { useAppCtx } from '../../../loaders/providers/appProvider'
import { Icon } from '../../shared/icons'

export const DesktopSidebar = () => {
  const { workspaceId } = getRoute().params
  const { userMembershipWorkspaces, userInviteWorkspaces, createWorkspace } = useAppCtx()
  return (
    <nav
      aria-label='Sidebar'
      className='hidden md:block md:flex-shrink-0 md:overflow-y-auto md:bg-gray-800'
    >
      <div className='relative flex w-28 flex-col space-y-3 p-3 h-full'>
        {userMembershipWorkspaces.map(({ workspace }) => (
          <Blink
            key={workspace.id}
            href={`/app/${workspace.id}`}
            className={classNames(
              workspace.id === workspaceId
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
              'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium',
            )}
            aria-current={workspace.id === workspaceId ? 'page' : undefined}
          >
            <Icon
              name={workspace.icon}
              className={classNames(
                workspace.id === workspaceId
                  ? 'text-white'
                  : 'text-indigo-300 group-hover:text-white',
                'h-6 w-6',
              )}
              aria-hidden='true'
            />
            <span className='mt-2 text-center'>{workspace.name}</span>
          </Blink>
        ))}
        {userInviteWorkspaces.length ? <div className='border-t border-indigo-700' /> : null}
        {userInviteWorkspaces.map(({ workspace }) => (
          <Blink
            key={workspace.id}
            href={`/app/${workspace.id}`}
            className={classNames(
              workspace.id === workspaceId
                ? 'bg-indigo-800 text-white'
                : 'text-gray-500 hover:bg-indigo-800 hover:text-white',
              'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium',
            )}
            aria-current={workspace.id === workspaceId ? 'page' : undefined}
          >
            <Icon
              name={workspace.icon}
              className={classNames(
                workspace.id === workspaceId
                  ? 'text-white'
                  : 'text-gray-500 group-hover:text-white',
                'h-6 w-6',
              )}
              aria-hidden='true'
            />
            <span className='mt-2'>{workspace.name}</span>
          </Blink>
        ))}
        <div className='grow' />
        <button
          key={'Create Workspace'}
          onClick={createWorkspace}
          className={classNames(
            'text-gray-500 hover:bg-indigo-800 hover:text-white',
            'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium',
          )}
        >
          <FolderPlusIcon
            className={classNames('text-indigo-300 group-hover:text-white', 'h-6 w-6')}
            aria-hidden='true'
          />
          <span className='mt-2'>{'+Workspace'}</span>
        </button>
      </div>
    </nav>
  )
}
