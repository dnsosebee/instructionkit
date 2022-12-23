import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { useSessionCtx } from '../../../src/components/loaders/providers/sessionProvider/sessionProvider'
import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import { AppLayout } from '../../../src/components/views/app/layout/appLayout'
import { SettingsFormLayout } from '../../../src/components/views/app/layout/settingsFormLayouts'
import Loading from '../../../src/components/views/shared/loading'
import { Database } from '../../../src/lib/database.types'
import { setRoute } from '../../../src/lib/route'
import { UpdatePassword } from './updatepassword'

const ProfilePage = () => {
  setRoute({ route: `/app/profile`, action: 'none' })
  return <RootHandler />
}

export default ProfilePage

/**
 *
 */

type Profiles = Database['public']['Tables']['profiles']['Row']

export const ProfileView = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSessionCtx().session.user
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<Profiles['company'] | null>(null)
  const [title, setTitle] = useState<Profiles['title'] | null>(null)
  const [about, setAbout] = useState<Profiles['about'] | null>(null)
  const [fullName, setFullName] = useState<Profiles['full_name'] | null>(null)
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null)

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, title, about, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullName(data.full_name)
        setTitle(data.title)
        setAbout(data.about)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        company,
        title,
        about,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return loading || !user ? (
    <Loading />
  ) : (
    <div className='w-full'>
      <AppLayout withWorkspace={false}>
        <SettingsFormLayout>
          <div>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
              <div className='md:col-span-1'>
                <div className='px-4 sm:px-0'>
                  <h3 className='text-lg font-medium leading-6 text-white'>Profile</h3>
                  {/* <p className='mt-1 text-sm text-gray-600'>
                This information will be displayed publicly so be careful what you share.
              </p> */}
                </div>
              </div>
              <div className='mt-5 md:col-span-2 md:mt-0'>
                <form onSubmit={e => e.preventDefault()}>
                  <div className='shadow sm:overflow-hidden sm:rounded-md'>
                    <div className='space-y-6 px-4 py-5 sm:p-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-300'>Email</label>
                        <input
                          type='text'
                          name='email'
                          id='email'
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-not-allowed'
                          value={user?.email}
                          disabled
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-300'>Full name</label>
                        <input
                          type='text'
                          name='full_name'
                          id='full_name'
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='John Doe'
                          value={fullName || ''}
                          onChange={e => setFullName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-300'>Company</label>
                        <input
                          type='text'
                          name='company'
                          id='company'
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='Acme Inc.'
                          value={company || ''}
                          onChange={e => setCompany(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-300'>Title</label>
                        <input
                          type='text'
                          name='title'
                          id='title'
                          className='mt-1 block w-full rounded-md border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='Designer'
                          value={title || ''}
                          onChange={e => setTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor='about' className='block text-sm font-medium text-gray-300'>
                          About
                        </label>
                        <div className='mt-1'>
                          <textarea
                            id='about'
                            name='about'
                            rows={3}
                            className='mt-1 block w-full rounded-md border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            placeholder='you@example.com'
                            value={about || ''}
                            onChange={e => setAbout(e.target.value)}
                          />
                        </div>
                        <p className='mt-2 text-sm text-gray-300'>
                          Brief description for your profile.
                        </p>
                      </div>

                      {/* <div>
                    <label className='block text-sm font-medium text-gray-300'>Photo</label>
                    <div className='mt-1 flex items-center'>
                      <span className='inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100'>
                        <svg
                          className='h-full w-full text-gray-300'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                        </svg>
                      </span>
                      <button
                        type='button'
                        className='ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      >
                        Change
                      </button>
                    </div>
                  </div> */}
                    </div>
                    <div className='px-4 py-3 text-right sm:px-6'>
                      <button
                        type='submit'
                        className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        onClick={updateProfile}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className='hidden sm:block' aria-hidden='true'>
            <div className='py-5'>
              <div className='border-t border-gray-700' />
            </div>
          </div>

          <UpdatePassword redirectUrl={null} />

          {/* 
      <div className='hidden sm:block' aria-hidden='true'>
        <div className='py-5'>
          <div className='border-t border-gray-200' />
        </div>
      </div>

      <div className='mt-10 sm:mt-0'>
        <div className='md:grid md:grid-cols-3 md:gap-6'>
          <div className='md:col-span-1'>
            <div className='px-4 sm:px-0'>
              <h3 className='text-lg font-medium leading-6 text-white'>Personal Information</h3>
              <p className='mt-1 text-sm text-gray-600'>
                Use a permanent address where you can receive mail.
              </p>
            </div>
          </div>
          <div className='mt-5 md:col-span-2 md:mt-0'>
            <form action='#' method='POST'>
              <div className='overflow-hidden shadow sm:rounded-md'>
                <div className='bg-white px-4 py-5 sm:p-6'>
                  <div className='grid grid-cols-6 gap-6'>
                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-300'
                      >
                        First name
                      </label>
                      <input
                        type='text'
                        name='first-name'
                        id='first-name'
                        autoComplete='given-name'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='last-name'
                        className='block text-sm font-medium text-gray-300'
                      >
                        Last name
                      </label>
                      <input
                        type='text'
                        name='last-name'
                        id='last-name'
                        autoComplete='family-name'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-4'>
                      <label
                        htmlFor='email-address'
                        className='block text-sm font-medium text-gray-300'
                      >
                        Email address
                      </label>
                      <input
                        type='text'
                        name='email-address'
                        id='email-address'
                        autoComplete='email'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3'>
                      <label htmlFor='country' className='block text-sm font-medium text-gray-300'>
                        Country
                      </label>
                      <select
                        id='country'
                        name='country'
                        autoComplete='country-name'
                        className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>

                    <div className='col-span-6'>
                      <label
                        htmlFor='street-address'
                        className='block text-sm font-medium text-gray-300'
                      >
                        Street address
                      </label>
                      <input
                        type='text'
                        name='street-address'
                        id='street-address'
                        autoComplete='street-address'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-6 lg:col-span-2'>
                      <label htmlFor='city' className='block text-sm font-medium text-gray-300'>
                        City
                      </label>
                      <input
                        type='text'
                        name='city'
                        id='city'
                        autoComplete='address-level2'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3 lg:col-span-2'>
                      <label htmlFor='region' className='block text-sm font-medium text-gray-300'>
                        State / Province
                      </label>
                      <input
                        type='text'
                        name='region'
                        id='region'
                        autoComplete='address-level1'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3 lg:col-span-2'>
                      <label
                        htmlFor='postal-code'
                        className='block text-sm font-medium text-gray-300'
                      >
                        ZIP / Postal code
                      </label>
                      <input
                        type='text'
                        name='postal-code'
                        id='postal-code'
                        autoComplete='postal-code'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
                  <button
                    type='submit'
                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='hidden sm:block' aria-hidden='true'>
        <div className='py-5'>
          <div className='border-t border-gray-200' />
        </div>
      </div>

      <div className='mt-10 sm:mt-0'>
        <div className='md:grid md:grid-cols-3 md:gap-6'>
          <div className='md:col-span-1'>
            <div className='px-4 sm:px-0'>
              <h3 className='text-lg font-medium leading-6 text-white'>Notifications</h3>
              <p className='mt-1 text-sm text-gray-600'>
                Decide which communications you'd like to receive and how.
              </p>
            </div>
          </div>
          <div className='mt-5 md:col-span-2 md:mt-0'>
            <form action='#' method='POST'>
              <div className='overflow-hidden shadow sm:rounded-md'>
                <div className='space-y-6 bg-white px-4 py-5 sm:p-6'>
                  <fieldset>
                    <legend className='sr-only'>By Email</legend>
                    <div className='text-base font-medium text-white' aria-hidden='true'>
                      By Email
                    </div>
                    <div className='mt-4 space-y-4'>
                      <div className='flex items-start'>
                        <div className='flex h-5 items-center'>
                          <input
                            id='comments'
                            name='comments'
                            type='checkbox'
                            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                          />
                        </div>
                        <div className='ml-3 text-sm'>
                          <label htmlFor='comments' className='font-medium text-gray-300'>
                            Comments
                          </label>
                          <p className='text-gray-500'>
                            Get notified when someones posts a comment on a posting.
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start'>
                        <div className='flex h-5 items-center'>
                          <input
                            id='candidates'
                            name='candidates'
                            type='checkbox'
                            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                          />
                        </div>
                        <div className='ml-3 text-sm'>
                          <label htmlFor='candidates' className='font-medium text-gray-300'>
                            Candidates
                          </label>
                          <p className='text-gray-500'>
                            Get notified when a candidate applies for a job.
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start'>
                        <div className='flex h-5 items-center'>
                          <input
                            id='offers'
                            name='offers'
                            type='checkbox'
                            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                          />
                        </div>
                        <div className='ml-3 text-sm'>
                          <label htmlFor='offers' className='font-medium text-gray-300'>
                            Offers
                          </label>
                          <p className='text-gray-500'>
                            Get notified when a candidate accepts or rejects an offer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className='contents text-base font-medium text-white'>
                      Push Notifications
                    </legend>
                    <p className='text-sm text-gray-500'>
                      These are delivered via SMS to your mobile phone.
                    </p>
                    <div className='mt-4 space-y-4'>
                      <div className='flex items-center'>
                        <input
                          id='push-everything'
                          name='push-notifications'
                          type='radio'
                          className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                        />
                        <label
                          htmlFor='push-everything'
                          className='ml-3 block text-sm font-medium text-gray-300'
                        >
                          Everything
                        </label>
                      </div>
                      <div className='flex items-center'>
                        <input
                          id='push-email'
                          name='push-notifications'
                          type='radio'
                          className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                        />
                        <label
                          htmlFor='push-email'
                          className='ml-3 block text-sm font-medium text-gray-300'
                        >
                          Same as email
                        </label>
                      </div>
                      <div className='flex items-center'>
                        <input
                          id='push-nothing'
                          name='push-notifications'
                          type='radio'
                          className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                        />
                        <label
                          htmlFor='push-nothing'
                          className='ml-3 block text-sm font-medium text-gray-300'
                        >
                          No push notifications
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
                  <button
                    type='submit'
                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
        </SettingsFormLayout>
      </AppLayout>
    </div>
  )
}
