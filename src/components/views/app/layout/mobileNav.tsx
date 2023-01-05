import { getRoute } from '../../../../lib/route/route'
import { Blink } from '../../../loaders/blink'
import {
  WORKSPACE_HREF,
  WORKSPACE_SETTINGS_HREF,
} from '../../../loaders/routeHandlers/workspaceHandler'

export const MobileNav = () => {
  const { workspaceId } = getRoute().params
  return (
    <div className='max-w-8xl mx-auto py-3 px-2 sm:px-4'>
      <Blink
        href={WORKSPACE_HREF(workspaceId)}
        className='block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100'
      >
        Projects
      </Blink>
      <Blink
        href={WORKSPACE_SETTINGS_HREF(workspaceId)}
        className='block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100'
      >
        Settings
      </Blink>
    </div>
  )
}
