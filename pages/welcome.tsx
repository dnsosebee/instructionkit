import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import PageRiver from './space/[spaceId]/river/[floemId]'

export default () => {
  const navigation = [{ name: 'InstructionKit', href: '#' }]

  return (
    <div className='bg-slate-900 relative w-full h-full max-w-7xl'>
      <Popover as='header' className='relative'>
        <div className='bg-slate-900 pt-6'>
          <nav
            className='relative mx-auto flex  items-center justify-between px-4 sm:px-6'
            aria-label='Global'
          >
            <div className='flex flex-1 items-center'>
              <div className='flex w-full items-center justify-between md:w-auto'>
                <a href='#'>
                  <span className='sr-only'>Your Company</span>
                  <img className='h-8 w-auto sm:h-10' src='/favicon.svg' alt='' />
                </a>
                <div className='-mr-2 flex items-center md:hidden'>
                  <Popover.Button className='focus-ring-inset inline-flex items-center justify-center rounded-md bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white'>
                    <span className='sr-only'>Open main menu</span>
                    <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
              </div>
              <div className='hidden space-x-8 md:ml-10 md:flex'>
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='text-base font-medium text-white hover:text-slate-300'
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className='hidden md:flex md:items-center md:space-x-6'>
              <a href='#' className='text-base font-medium text-white hover:text-slate-300'>
                Log in
              </a>
              <a
                href='#'
                className='inline-flex items-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-base font-medium text-white hover:bg-slate-700'
              >
                Start building
              </a>
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
                  <img
                    className='h-8 w-auto'
                    src='https://tailwindui.com/img/logos/mark.svg?from-color=teal&from-shade=500&to-color=cyan&to-shade=600&toShade=600'
                    alt=''
                  />
                </div>
                <div className='-mr-2'>
                  <Popover.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-600'>
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
              </div>
              <div className='pt-5 pb-6'>
                <div className='space-y-1 px-2'>
                  {navigation.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      className='block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50'
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className='mt-6 px-5'>
                  <a
                    href='#'
                    className='block w-full rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 py-3 px-4 text-center font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700'
                  >
                    Start free trial
                  </a>
                </div>
                <div className='mt-6 px-5'>
                  <p className='text-center text-base font-medium text-slate-500'>
                    Existing customer?{' '}
                    <a href='#' className='text-slate-900 hover:underline'>
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      {/* 
      <div className='bg-slate-900 pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14'>
        <div className='mx-auto max-w-7xl lg:px-8'>
          <div className='lg:grid lg:grid-cols-2 lg:gap-8'>
            <div className='mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left'>
              <div className='lg:py-24'>
                <a
                  href='#'
                  className='inline-flex items-center rounded-full bg-black p-1 pr-2 text-white hover:text-slate-200 sm:text-base lg:text-sm xl:text-base'
                >
                  <span className='rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-3 py-0.5 text-sm font-semibold leading-5 text-white'>
                    We're hiring
                  </span>
                  <span className='ml-4 text-sm'>Visit our careers page</span>
                  <ChevronRightIcon className='ml-2 h-5 w-5 text-slate-500' aria-hidden='true' />
                </a>
                <h1 className='mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl'>
                  <span className='block'>Beautifully simple</span>
                  <span className='block bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text pb-3 text-transparent sm:pb-5'>
                    instructions
                  </span>
                </h1>
                <p className='text-base text-slate-300 sm:text-xl lg:text-lg xl:text-xl'>
                  When customers open your product, one thing remains between them and your
                  beautiful product: the instructions. Make a good first impression with beautifully
                  simple instructions.
                </p>
                <div className='mt-10 sm:mt-12'>
                  <form action='#' className='sm:mx-auto sm:max-w-xl lg:mx-0'>
                    <div className='sm:flex'>
                      <div className='min-w-0 flex-1'>
                        <label htmlFor='email' className='sr-only'>
                          Email address
                        </label>
                        <input
                          id='email'
                          type='email'
                          placeholder='Enter your email'
                          className='block w-full rounded-md border-0 px-4 py-3 text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900'
                        />
                      </div>
                      <div className='mt-3 sm:mt-0 sm:ml-3'>
                        <button
                          type='submit'
                          className='block w-full rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 py-3 px-4 font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900'
                        >
                          Register
                        </button>
                      </div>
                    </div>
                    <p className='mt-3 text-sm text-slate-300 sm:mt-4'>
                      Register now for the public beta, starting in Q1 2023!
                    </p>
                  </form>
                </div>
              </div>
            </div>
            <div className='mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0'>
              <div className='mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0'>
                <img
                  className='w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none'
                  src='/networkIllustration.png'
                  alt=''
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className='px-5 bg-slate-900 h-full'>
        <PageRiver spaceId={'uXa1ZC'} floemId={'floem-WVP738wN6a7V7fyfGVih7'} />
      </div>
    </div>
  )
}
