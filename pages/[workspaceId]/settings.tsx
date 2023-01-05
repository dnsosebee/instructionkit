import { RadioGroup } from '@headlessui/react'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { Blink } from '../../src/components/loaders/blink'
import { useAppCtx } from '../../src/components/loaders/providers/appProvider'
import { RootHandler } from '../../src/components/loaders/routeHandlers/rootHandler'
import {
  WORKSPACE_HREF,
  WORKSPACE_SETTINGS_HREF,
} from '../../src/components/loaders/routeHandlers/workspaceHandler'
import { AppLayout } from '../../src/components/views/app/layout/appLayout'
import { ICONS } from '../../src/components/views/shared/icons'
import { getRoute, setRoute } from '../../src/lib/route/route'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  return {
    props: {
      workspaceId,
    },
  }
}

const SettingsPage = ({ workspaceId }: { workspaceId: string }) => {
  useEffect(() => {
    setRoute({ route: WORKSPACE_SETTINGS_HREF(workspaceId), action: 'none' })
  }, [])
  return <RootHandler />
}

export default SettingsPage

/**
 *
 */

export const SettingsView = () => {
  const { appRep, userMembershipWorkspaces, deleteMembership, deleteWorkspace } = useAppCtx()
  const { workspaceId } = getRoute().params
  const { workspace, membership } = userMembershipWorkspaces.find(
    ({ workspace }) => workspace.id === workspaceId,
  )!

  const handleIconChange = (icon: string) => {
    appRep.mutate.updateWorkspace({
      id: workspace.id,
      icon,
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    appRep.mutate.updateWorkspace({
      id: workspace.id,
      name: e.target.value,
    })
  }

  const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = form.elements.namedItem('email') as HTMLInputElement
    appRep.mutate.createOrUpdateInvite({
      workspaceId: workspace.id,
      email: email.value,
      accessPolicy: 'editor',
    })
    alert('Invite sent!')
  }

  const handleLeave = async () => {
    if (confirm(`Are you sure you want to leave ${workspace.name}?`)) {
      deleteMembership(membership)
    }
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${workspace.name}?`)) {
      deleteWorkspace(workspace.id)
    }
  }

  return (
    <AppLayout>
      <div className='flex w-full flex-col items-center'>
        <div className='flex flex-col items-left space-y-6 my-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-100'>Workspace Settings</h1>
          </div>

          <div>
            <label htmlFor='workspace-name' className='block text-sm font-medium text-gray-100'>
              Workspace Name
            </label>
            <div className='mt-1'>
              <input
                name='workspace-name'
                id='workspace-name'
                className='text-gray-100 bg-gray-700 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
                placeholder='Acme Inc.'
                value={workspace.name}
                onChange={handleNameChange}
              />
            </div>
          </div>

          <div className='bg-white shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>Invite Members</h3>

              {/* <div>
              <div className='mt-6 flow-root'>
                <ul role='list' className='-my-5 divide-y divide-gray-200'>
                  {people.map(person => (
                    <li key={person.handle} className='py-4'>
                      <div className='flex items-center space-x-4'>
                        <div className='flex-shrink-0'>
                          <img className='h-8 w-8 rounded-full' src={person.imageUrl} alt='' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium text-gray-900'>
                            {person.name}
                          </p>
                          <p className='truncate text-sm text-gray-500'>{'@' + person.handle}</p>
                        </div>
                        <div>
                          <a
                            href='#'
                            className='inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50'
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-6'>
                <a
                  href='#'
                  className='flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
                >
                  View all
                </a>
              </div>
            </div> */}

              {/* <div className='mt-2 max-w-xl text-sm text-gray-500'>
              <p>Invite new members</p>
            </div> */}
              <form className='mt-5 sm:flex sm:items-center' onSubmit={handleInvite}>
                <div className='w-full sm:max-w-xs'>
                  <label htmlFor='email' className='sr-only'>
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    placeholder='teammate@company.com'
                  />
                </div>
                <button
                  type='submit'
                  className='mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Invite
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <h2 className='sm:text-sm font-medium text-gray-100'> Icon</h2>
            </div>
            <RadioGroup value={workspace.icon} onChange={handleIconChange} className='mt-2'>
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

          <div>
            {/* done button */}
            <Blink
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              href={WORKSPACE_HREF(workspace.id)}
            >
              Done
            </Blink>
          </div>

          {/* leave workspace button, secondary red */}
          <div>
            {/* leave button */}
            <button
              type='button'
              className='inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md shadow-sm text-white bg-transparent hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={handleLeave}
            >
              Leave Workspace
            </button>
          </div>

          <div>
            {/* delete button */}
            <button
              type='button'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={handleDelete}
            >
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
