import classNames from 'classnames'
import { ForkType, getRoute } from '../../../../lib/route'
import { Blink } from '../../../loaders/blink'

export const DesktopNav = () => {
  const {
    params: { workspaceId },
    forks: { workspace: workspaceFork },
  } = getRoute()
  return (
    <nav aria-label='Global' className='flex space-x-10'>
      <Blink
        href={`/app/${workspaceId}`}
        className={classNames(
          workspaceFork.type === ForkType.Default
            ? 'bg-indigo-800 text-white'
            : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
          'group w-full p-3 rounded-md',
        )}
        aria-current={workspaceFork.type === ForkType.Default ? 'page' : undefined}
      >
        Projects
      </Blink>
      <Blink
        href={`/app/${workspaceId}/settings`}
        className={classNames(
          workspaceFork.type === ForkType.Named && workspaceFork.urlSegment === 'settings'
            ? 'bg-indigo-800 text-white'
            : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
          'group w-full p-3 rounded-md',
        )}
        aria-current={
          workspaceFork.type === ForkType.Named && workspaceFork.urlSegment === 'settings'
            ? 'page'
            : undefined
        }
      >
        Settings
      </Blink>
    </nav>
  )
}
