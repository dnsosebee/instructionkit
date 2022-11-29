import { RadioGroup } from '@headlessui/react'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import AppLayout, { ICONS } from '../../../src/components/layout/appLayout'
import { useAppContext } from '../../../src/components/layout/appProvider'
import { logger } from '../../../src/logger'

// get workspaceId from routes
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  return {
    props: {
      workspaceId,
    },
  }
}

export default ({ workspaceId }: { workspaceId: string }) => {
  logger.debug('workspaceId', workspaceId)
  return (
    <AppLayout selectedWorkspaceId={workspaceId}>
      <Settings workspaceId={workspaceId} />
    </AppLayout>
  )
}

const Settings = ({ workspaceId }: { workspaceId: string }) => {
  const { selectedWorkspace, appMutate } = useAppContext()

  const handleIconChange = (icon: string) => {
    appMutate.updateWorkspace({
      id: selectedWorkspace.id,
      icon,
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    appMutate.updateWorkspace({
      id: selectedWorkspace.id,
      name: e.target.value,
    })
  }

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='flex flex-col items-left space-y-6 my-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-100'>Workspace Settings</h1>
        </div>
        <div>
          <label htmlFor='workspace-name' className='block text-sm font-medium text-gray-100'>
            Name
          </label>
          <div className='mt-1'>
            <input
              name='workspace-email'
              id='workspace-email'
              className='text-gray-100 bg-gray-700 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              placeholder='Acme Inc.'
              value={selectedWorkspace.name}
              onChange={handleNameChange}
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <h2 className='sm:text-sm font-medium text-gray-100'> Icon</h2>
          </div>
          <RadioGroup value={selectedWorkspace.icon} onChange={handleIconChange} className='mt-2'>
            <RadioGroup.Label className='sr-only'> Choose a workspace icon</RadioGroup.Label>
            <div className='grid grid-cols-3 gap-3 sm:grid-cols-6'>
              {Object.entries(ICONS).map(([iconName, IconComponent]) => (
                <RadioGroup.Option
                  key={iconName}
                  value={iconName}
                  className={({ active, checked }) =>
                    classNames(
                      'cursor-pointer focus:outline-none',
                      active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                      checked
                        ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                        : 'bg-slate-900 border-gray-700 text-gray-100 hover:bg-gray-600',
                      'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1',
                    )
                  }
                >
                  <RadioGroup.Label as='span'>
                    <IconComponent className='w-10' />
                  </RadioGroup.Label>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
