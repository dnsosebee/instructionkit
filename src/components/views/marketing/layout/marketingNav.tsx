import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Fragment } from 'react'
import { ROOT_HREF } from '../../../loaders/routeHandlers/rootHandler'
import Logo from '../../shared/logo'

// WARNING this is probably deprecated now

export default ({ children }: { children: JSX.Element }) => {
  // const navigation = [] as { name: string; href: string }[]

  return (
    <div className='w-full'>
      <Popover as='header' className='relative'>
        <div className='bg-gray-900 py-6'>
          <nav
            className='relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6'
            aria-label='Global'
          >
            <div className='flex flex-1 items-center'>
              <div className='flex w-full items-center justify-between md:w-auto'>
                <span className='sr-only'>InstructionKit</span>
                <Link href={ROOT_HREF}>
                  <Logo light={true} className='h-8 w-auto sm:h-10' />
                </Link>
                <div className='-mr-2 flex items-center md:hidden'>
                  <Popover.Button className='focus-ring-inset inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white'>
                    <span className='sr-only'>Open main menu</span>
                    <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
              </div>
              {/* <div className='hidden space-x-8 md:ml-10 md:flex'>
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='text-base font-medium text-white hover:text-gray-300'
                  >
                    {item.name}
                  </Link>
                ))}
              </div> */}
            </div>
            <div className='hidden md:flex md:items-center md:space-x-6'>
              <Link
                href={ROOT_HREF}
                className='text-base font-medium text-white hover:text-gray-300'
              >
                Sign in
              </Link>
              <Link
                href='/waitlist'
                className='inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white hover:bg-gray-700'
              >
                Start building
              </Link>
            </div>
          </nav>
        </div>

        <Transition
          as={Fragment}
          enter='duration-150 ease-out'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='duration-100 ease-in'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <Popover.Panel
            focus
            className='absolute inset-x-0 top-0 origin-top transform p-2 transition md:hidden'
          >
            <div className='overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5'>
              <div className='flex items-center justify-between px-5 pt-4'>
                <div>
                  <Logo light={false} className='h-8 w-auto sm:h-10' />
                </div>
                <div className='-mr-2'>
                  <Popover.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-600'>
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
              </div>
              <div className='pt-5 pb-6'>
                {/* <div className='space-y-1 px-2'>
                  {navigation.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className='block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50'
                    >
                      {item.name}
                    </Link>
                  ))}
                </div> */}
                <div className='mt-6 px-5'>
                  <Link
                    href='/waitlist'
                    className='block w-full rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 py-3 px-4 text-center font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700'
                  >
                    Start building
                  </Link>
                </div>
                <div className='mt-6 px-5'>
                  <p className='text-center text-base font-medium text-gray-500'>
                    Existing customer?{' '}
                    <Link href={ROOT_HREF} className='text-gray-900 hover:underline'>
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      <motion.div
        className='w-full h-full flex flex-col'
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
