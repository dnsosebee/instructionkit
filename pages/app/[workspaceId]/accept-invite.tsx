import { Dialog, Transition } from '@headlessui/react'
import { GetServerSideProps } from 'next'
import { Fragment, useRef, useState } from 'react'
import AppLayout, { AppPage } from '../../../src/components/layout/appLayout'
import { useAppContext } from '../../../src/components/layout/appProvider'
import { useSupaAuthed } from '../../../src/components/layout/supaProvider'
import { Icon } from '../../../src/components/shared/icons'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const workspaceId = params?.workspaceId as string
  return {
    props: {
      workspaceId,
    },
  }
}

export default ({ workspaceId }: { workspaceId: string }) => {
  return (
    <AppLayout workspaceId={workspaceId} selectedPage={AppPage.AcceptInvite}>
      <AcceptInvite />
    </AppLayout>
  )
}

const AcceptInvite = () => {
  const { user } = useSupaAuthed()
  const { appRep, workspace, userInvites } = useAppContext()
  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)

  // this can be assumed based on routing that happens within the AppProvider component
  const invite = userInvites.find(invite => invite.workspaceId === workspace.id)!

  const handleAccept = () => {
    appRep.mutate.acceptInvite({
      invite,
      userId: user.id,
    })
    setOpen(false)
    window.location.href = `/app/${workspace.id}`
  }

  const handleDecline = () => {
    appRep.mutate.deleteInvite(invite)
    setOpen(false)
    window.location.href = `/app`
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={v => v}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div>
                  <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                    <Icon name={workspace.icon} className='h-6 w-6 text-green-600' />
                  </div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                      You've been invited to join{' '}
                      <span className='text-indigo-400'>{workspace.name}</span>
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>
                        You may accept or decline this invitation. If you accept, you will be able
                        to view and edit the workspace.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm'
                    onClick={handleAccept}
                  >
                    Accept
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm'
                    onClick={handleDecline}
                    ref={cancelButtonRef}
                  >
                    Decline
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
