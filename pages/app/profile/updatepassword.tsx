import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { useSessionCtx } from '../../../src/components/loaders/providers/sessionProvider/sessionProvider'
import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import { AppLayout } from '../../../src/components/views/app/layout/appLayout'
import { SettingsFormLayout } from '../../../src/components/views/app/layout/settingsFormLayouts'
import Loading from '../../../src/components/views/shared/loading'
import { setRoute } from '../../../src/lib/route'

const UpdatePasswordPage = () => {
  setRoute({ route: `/app/profile/updatepassword`, action: 'none' })
  return <RootHandler />
}

export default UpdatePasswordPage

/**
 *
 */

export const UpdatePasswordView = () => {
  return (
    <AppLayout withWorkspace={false}>
      <SettingsFormLayout>
        <UpdatePassword redirectUrl={'/app'} />
      </SettingsFormLayout>
    </AppLayout>
  )
}

export const UpdatePassword = ({ redirectUrl }: { redirectUrl: string | null }) => {
  const [loading, setLoading] = useState(false)
  const {
    session: { user },
  } = useSessionCtx()
  const supabase = useSupabaseClient()

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const { error } = await supabase.auth.updateUser({
        email: user.email,
        password: e.currentTarget.password.value,
      })
      if (error) throw error
      alert('Password updated!')
      if (redirectUrl) {
        setRoute({ route: redirectUrl, action: 'push' })
      }
    } catch (error) {
      alert('Error updating the password!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <div className='mt-10 sm:mt-0'>
      <div className='md:grid md:grid-cols-3 md:gap-6'>
        <div className='md:col-span-1'>
          <div className='px-4 sm:px-0'>
            <h3 className='text-lg font-medium leading-6 text-white'>Update Password</h3>
            <p className='mt-1 text-sm text-gray-300'>
              Use a secure password to protect your account.
            </p>
          </div>
        </div>
        <div className='mt-5 md:mt-0 md:col-span-2'>
          <form onSubmit={updatePassword}>
            <div className='shadow sm:rounded-md sm:overflow-hidden'>
              <div className='px-4 py-5 pace-y-6 sm:p-6'>
                <div className='grid grid-cols-3 gap-6'>
                  <div className='col-span-3 sm:col-span-2'>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
                      New password
                    </label>
                    <div className='mt-1 flex rounded-md shadow-sm'>
                      <input
                        type='password'
                        name='password'
                        id='password'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        placeholder='New password'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='px-4 py-3text-right sm:px-6'>
                <button
                  type='submit'
                  className='inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
                >
                  Update password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
