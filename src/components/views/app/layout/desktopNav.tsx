import classNames from 'classnames'
import { ForkType, getRoute } from '../../../../lib/route/route'
import { Blink } from '../../../loaders/blink'
import {
  WORKSPACE_HREF,
  WORKSPACE_SETTINGS_HREF,
} from '../../../loaders/routeHandlers/workspaceHandler'

export const DesktopNav = () => {
  const {
    params: { workspaceId },
    forks: { workspace: workspaceFork },
  } = getRoute()
  return (
    <nav aria-label='Global' className='flex space-x-10'>
      <Blink
        href={WORKSPACE_HREF(workspaceId)}
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
        href={WORKSPACE_SETTINGS_HREF(workspaceId)}
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
