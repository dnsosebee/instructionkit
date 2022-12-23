import { getRoute } from '../../../../lib/route'
import { Blink } from '../../../loaders/blink'

export const MobileNav = () => {
  const { workspaceId } = getRoute().params
  return (
    <div className='max-w-8xl mx-auto py-3 px-2 sm:px-4'>
      <Blink
        href={`/app/${workspaceId}`}
        className='block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100'
      >
        Projects
      </Blink>
      <Blink
        href={`/app/${workspaceId}/settings`}
        className='block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100'
      >
        Settings
      </Blink>
    </div>
  )
}
