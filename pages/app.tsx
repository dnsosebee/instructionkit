import { Dialog, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, FolderIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { logger, User } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { Replicache } from 'replicache'
import { spaceExists } from 'replicache-nextjs/lib/backend'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { useSubscribe } from 'replicache-react'
import Loading from '../src/components/shared/loading'
import Logo from '../src/components/shared/logo'
import { listMemberships, MEMBERSHIP_SPACE_ID } from '../src/model/memberships/membership'
import { membershipMutators, MembershipMutators } from '../src/model/memberships/mutators'

const navigation: { name: string; href: string; children: { name: string; href: string }[] }[] = [
  {
    name: 'Inboxes',
    href: '#',
    children: [
      // { name: 'Technical Support', href: '#' },
      // { name: 'Sales', href: '#' },
      // { name: 'General', href: '#' },
    ],
  },
  { name: 'Reporting', href: '#', children: [] },
  { name: 'Settings', href: '#', children: [] },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps: GetServerSideProps = async context => {
  if (!(await spaceExists(MEMBERSHIP_SPACE_ID))) {
    logger.debug('space does not exist')
  }

  logger.debug('space exists')

  return {
    props: {
      spaceId: MEMBERSHIP_SPACE_ID,
    },
  }
}

export default () => {
  const membershipRep = useReplicache<MembershipMutators>({
    name: MEMBERSHIP_SPACE_ID,
    mutators: membershipMutators,
  })
  const user = useUser()
  if (!membershipRep || !user) {
    return <Loading />
  }
  // membershipRep.mutate.createOrUpdateMembership(genMembership('2', '2', '2'))
  return <App membershipRep={membershipRep} user={user} />
}

const App = ({
  membershipRep,
  user,
}: {
  membershipRep: Replicache<MembershipMutators>
  user: User
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabaseClient = useSupabaseClient()
  const memberships = useSubscribe(membershipRep, listMemberships, [], [membershipRep])
  const userMemberships = memberships.filter(m => m.userId === user.id)

  const workspaces = 
    userMemberships.map(m => {m.workspaceId)
    { name: 'Open', href: '#', icon: FolderIcon, current: true },
    { name: 'Archive', href: '#', icon: FolderIcon, current: false },
    { name: 'Customers', href: '#', icon: FolderIcon, current: false },
    { name: 'Flagged', href: '#', icon: FolderIcon, current: false },
    { name: 'Spam', href: '#', icon: FolderIcon, current: false },
    { name: 'Drafts', href: '#', icon: FolderIcon, current: false },
  ]

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut()
    window.location.href = '/signin'
  }

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full overflow-hidden">
        ```
      */}
      <div className='flex h-full w-full flex-col'>
        {/* Top nav*/}
        <header className='relative flex h-16 flex-shrink-0 items-center bg-white'>
          {/* Logo area */}
          <div className='absolute inset-y-0 left-0 md:static md:flex-shrink-0'>
            <Link
              href='#'
              className='flex h-16 w-16 items-center justify-center bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:w-28'
            >
              <Image
                className='h-8 w-auto'
                src='/IKlight.svg'
                alt='InstructionKit'
                height={50}
                width={50}
              />
            </Link>
          </div>

          {/* Picker area */}
          <div className='mx-auto md:hidden'>
            <div className='relative'>
              <label htmlFor='inbox-select' className='sr-only'>
                Choose inbox
              </label>
              <select
                id='inbox-select'
                className='rounded-md border-0 bg-none pl-3 pr-8 text-base font-medium text-gray-900 focus:ring-2 focus:ring-indigo-600'
                defaultValue={workspaces.find(item => item.current)!.name}
              >
                {workspaces.map(item => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-2'>
                <ChevronDownIcon className='h-5 w-5 text-gray-500' aria-hidden='true' />
              </div>
            </div>
          </div>

          {/* Menu button area */}
          <div className='absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 md:hidden'>
            {/* Mobile menu button */}
            <button
              type='button'
              className='-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600'
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
            </button>
          </div>

          {/* Desktop nav area */}
          <div className='hidden md:flex md:min-w-0 md:flex-1 md:items-center md:justify-between'>
            <div className='min-w-0 flex-1'>
              {/* <div className='relative max-w-2xl text-gray-400 focus-within:text-gray-500'>
                <label htmlFor='desktop-search' className='sr-only'>
                  Search
                </label>
                <input
                  id='desktop-search'
                  type='search'
                  placeholder='Search'
                  className='block w-full border-transparent pl-12 placeholder-gray-500 focus:border-transparent focus:ring-0 sm:text-sm'
                />
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4'>
                  <MagnifyingGlassIcon className='h-5 w-5' aria-hidden='true' />
                </div>
              </div> */}
            </div>
            <div className='ml-10 flex flex-shrink-0 items-center space-x-10 pr-4'>
              <nav aria-label='Global' className='flex space-x-10'>
                <Link href='#' className='text-sm font-medium text-gray-900'>
                  Projects
                </Link>
                <Link href='#' className='text-sm font-medium text-gray-900'>
                  Workplace Settings
                </Link>
              </nav>
              <div className='flex items-center space-x-8'>
                {/* <span className='inline-flex'>
                  <a
                    href='#'
                    className='-mx-1 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500'
                  >
                    <span className='sr-only'>View notifications</span>
                    <BellIcon className='h-6 w-6' aria-hidden='true' />
                  </a>
                </span> */}

                <Menu as='div' className='relative inline-block text-left'>
                  <Menu.Button className='flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'>
                    <span className='sr-only'>Open user menu</span>
                    <Image
                      className='h-8 w-8 rounded-full'
                      src='/avatar.jpeg'
                      alt='avatar'
                      width={50}
                      height={50}
                    />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <div className='py-1'>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href='/profile'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full',
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left',
                              )}
                            >
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile menu, show/hide this `div` based on menu open/closed state */}
          <Transition.Root show={mobileMenuOpen} as={Fragment}>
            <Dialog as='div' className='relative z-40 md:hidden' onClose={setMobileMenuOpen}>
              <Transition.Child
                as={Fragment}
                enter='transition-opacity ease-linear duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='transition-opacity ease-linear duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-600 sm:bg-opacity-75' />
              </Transition.Child>

              <div className='fixed inset-0 z-40'>
                <Transition.Child
                  as={Fragment}
                  enter='transition ease-out duration-150 sm:ease-in-out sm:duration-300'
                  enterFrom='transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100'
                  enterTo='transform opacity-100 scale-100  sm:translate-x-0 sm:scale-100 sm:opacity-100'
                  leave='transition ease-in duration-150 sm:ease-in-out sm:duration-300'
                  leaveFrom='transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100'
                  leaveTo='transform opacity-0 scale-110  sm:translate-x-full sm:scale-100 sm:opacity-100'
                >
                  <Dialog.Panel
                    className='fixed inset-0 z-40 h-full w-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:shadow-lg'
                    aria-label='Global'
                  >
                    <div className='flex h-16 items-center justify-between px-4 sm:px-6'>
                      <a href='#'>
                        <Logo light={false} />
                      </a>
                      <button
                        type='button'
                        className='-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600'
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className='sr-only'>Close main menu</span>
                        <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                      </button>
                    </div>
                    <div className='max-w-8xl mx-auto mt-2 px-4 sm:px-6'>
                      <div className='relative text-gray-400 focus-within:text-gray-500'>
                        <label htmlFor='mobile-search' className='sr-only'>
                          Search all inboxes
                        </label>
                        <input
                          id='mobile-search'
                          type='search'
                          placeholder='Search all inboxes'
                          className='block w-full rounded-md border-gray-300 pl-10 placeholder-gray-500 focus:border-indigo-600 focus:ring-indigo-600'
                        />
                        <div className='absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
                          <MagnifyingGlassIcon className='h-5 w-5' aria-hidden='true' />
                        </div>
                      </div>
                    </div>
                    <div className='max-w-8xl mx-auto py-3 px-2 sm:px-4'>
                      {navigation.map(item => (
                        <Fragment key={item.name}>
                          <a
                            href={item.href}
                            className='block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100'
                          >
                            {item.name}
                          </a>
                          {item.children.map(child => (
                            <a
                              key={child.name}
                              href={child.href}
                              className='block rounded-md py-2 pl-5 pr-3 text-base font-medium text-gray-500 hover:bg-gray-100'
                            >
                              {child.name}
                            </a>
                          ))}
                        </Fragment>
                      ))}
                    </div>
                    <div className='border-t border-gray-200 pt-4 pb-3'>
                      <div className='max-w-8xl mx-auto flex items-center px-4 sm:px-6'>
                        <div className='flex-shrink-0'>
                          <img className='h-10 w-10 rounded-full' src={'/avatar.jpeg'} alt='' />
                        </div>
                        <div className='ml-3 min-w-0 flex-1'>
                          <div className='truncate text-base font-medium text-gray-800'>
                            {'Whitney Francis'}
                          </div>
                          <div className='truncate text-sm font-medium text-gray-500'>
                            {'email@email'}
                          </div>
                        </div>
                        <a
                          href='#'
                          className='ml-auto flex-shrink-0 bg-white p-2 text-gray-400 hover:text-gray-500'
                        >
                          <span className='sr-only'>View notifications</span>
                          <BellIcon className='h-6 w-6' aria-hidden='true' />
                        </a>
                      </div>
                      <div className='max-w-8xl mx-auto mt-3 space-y-1 px-2 sm:px-4'>
                        {userNavigation.map(item => (
                          <a
                            key={item.name}
                            href={item.href}
                            className='block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50'
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </header>

        {/* Bottom section */}
        <div className='flex min-h-0 flex-1 overflow-hidden'>
          {/* Narrow sidebar*/}
          <nav
            aria-label='Sidebar'
            className='hidden md:block md:flex-shrink-0 md:overflow-y-auto md:bg-gray-800'
          >
            <div className='relative flex w-28 flex-col space-y-3 p-3'>
              {workspaces.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                      'h-6 w-6',
                    )}
                    aria-hidden='true'
                  />
                  <span className='mt-2'>{item.name}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* Main area */}
          <main className='min-w-0 flex-1 border-t border-gray-200 lg:flex'>
            {/* Primary column */}
            <section
              aria-labelledby='primary-heading'
              className='flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last'
            >
              <h1 id='primary-heading' className='sr-only'>
                Home
              </h1>
              {/* Your content */}
            </section>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className='hidden lg:order-first lg:block lg:flex-shrink-0'>
              <div className='relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-gray-100'>
                {/* Your content */}
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  )
}
