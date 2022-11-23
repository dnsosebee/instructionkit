import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Database } from '../src/lib/database.types'

export default () => {
  const user = useUser()

  const supabase = useSupabaseClient<Database>()

  const setup = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`full_name, company_website, title, registered`)
      .eq('id', user!.id)
      .single()
    if (error) {
      console.log(error)
      return
    }
    if (!data) {
      console.log('no data')
      return
    }

    const registered = data.registered
    if (registered) {
      window.location.href = '/settings'
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fullName = e.currentTarget['full-name'].value
    const company = e.currentTarget['company'].value
    const title = e.currentTarget['job-title'].value
    // update the profiles table
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        company,
        title,
        registered: true,
      })
      .eq('id', user!.id)

    if (error) {
      console.log(error)
      return
    }
    window.location.href = '/settings'
  }

  useEffect(() => {
    if (user) {
      setup()
    }
  }, [user])

  return (
    <div className='bg-white p-6'>
      <Image src='/dark.svg' alt='logo' width={100} height={100} className='mx-auto' />

      <form className='space-y-8 divide-y divide-gray-200' onSubmit={handleSubmit}>
        <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
          <div className='space-y-6 pt-8 sm:space-y-5 sm:pt-10'>
            <div>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>
                Welcome to InstructionKit!
              </h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                Help us by filling out the following information.
              </p>
            </div>
            <div className='space-y-6 sm:space-y-5'>
              <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5'>
                <label
                  htmlFor='first-name'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Full Name
                </label>
                <div className='mt-1 sm:col-span-2 sm:mt-0'>
                  <input
                    type='text'
                    name='full-name'
                    id='full-name'
                    autoComplete='given-name'
                    className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                    placeholder='John Doe'
                    required
                  />
                </div>
              </div>

              <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5'>
                <label
                  htmlFor='company'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Company
                </label>
                <div className='mt-1 sm:col-span-2 sm:mt-0'>
                  <input
                    type='text'
                    name='company'
                    id='company'
                    autoComplete='company'
                    className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                    placeholder='Acme Inc.'
                    required
                  />
                </div>
              </div>

              <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5'>
                <label
                  htmlFor='job-title'
                  className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                >
                  Title
                </label>
                <div className='mt-1 sm:col-span-2 sm:mt-0'>
                  <input
                    type='text'
                    name='job-title'
                    id='job-title'
                    autoComplete='job-title'
                    className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                    placeholder='Designer'
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-5'>
          <div className='flex justify-end'>
            <button
              type='submit'
              className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Get Started
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
