import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { logger as parentLogger } from '../../../../lib/logger'
import { getRoute, setRoute } from '../../../../lib/route/route'
import { Workspace } from '../../../../model/schema/types/workspace'
import { useAppCtx } from '../../../loaders/providers/appProvider'
import { WORKSPACE_HREF } from '../../../loaders/routeHandlers/workspaceHandler'

const logger = parentLogger.child({ component: 'Picker' })

export const MobilePicker = () => {
  const { workspaceId } = getRoute().params
  const { userInviteWorkspaces, userMembershipWorkspaces } = useAppCtx()

  const handlePickerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    logger.debug('handlePickerChange', { id })
    setRoute({ route: WORKSPACE_HREF(id), action: 'push' })
  }

  return (
    <div className='relative'>
      <label htmlFor='workspace-select' className='sr-only'>
        Choose workspace
      </label>
      <select
        id='workspace-select'
        className='rounded-md border-0 bg-none pl-3 pr-8 text-base font-medium text-gray-900 focus:ring-2 focus:ring-indigo-600'
        defaultValue={workspaceId}
        onChange={handlePickerChange}
      >
        {userMembershipWorkspaces.map(({ workspace }) => (
          <PickerOption key={workspace.id} workspace={workspace} />
        ))}
        {userInviteWorkspaces.map(({ workspace }) => (
          <PickerOption key={workspace.id} workspace={workspace} />
        ))}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-2'>
        <ChevronDownIcon className='h-5 w-5 text-gray-500' aria-hidden='true' />
      </div>
    </div>
  )
}

const PickerOption = ({ workspace }: { workspace: Workspace }) => {
  return (
    <option key={workspace.id} value={workspace.id}>
      {workspace.name}
    </option>
  )
}
