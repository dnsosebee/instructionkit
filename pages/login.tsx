import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import Account from './account'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div className='container p-52'>
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme='dark' />
      ) : (
        <Account session={session} />
      )}
    </div>
  )
}

export default Home
