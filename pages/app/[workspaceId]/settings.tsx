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

  return (
    <div className='flex w-full flex-col items-center'>
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
                <IconComponent className='w-16' />
              </RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
