import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMachine } from '@xstate/react'
import React, { useEffect } from 'react'
import SignIn from '../../../../../pages/signin'
import { Database } from '../../../../lib/database.types'
import Loading from '../../../shared/loading'
import Registration from '../../../v1/registration'
import { Profile, sessionStateMachine } from './sessionState'

type SessionContext = {
  session: Session
  supabase: ReturnType<typeof useSupabaseClient<Database>>
  profile: Profile
}

export const sessionContext = React.createContext<SessionContext | null>(null)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [current, send] = useMachine(sessionStateMachine)
  const supabase = useSupabaseClient<Database>()
  const respondToAuth = (event: string, session: Session | null) => {
    switch (event) {
      case 'SIGNED_IN':
        send('SIGNED_IN', { session })
        break
      case 'SIGNED_OUT':
        send('SIGNED_OUT')
        break
    }
  }
  const setProfile = (profile: Profile) => {
    if (profile.registered) {
      send('REGISTERED', { profile })
    } else {
      send('UNREGISTERED', { profile })
    }
  }
  useEffect(() => {
    supabase.auth.onAuthStateChange(respondToAuth)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.log(error)
        return
      }
      if (session) {
        respondToAuth('SIGNED_IN', session)
      } else {
        respondToAuth('SIGNED_OUT', null)
      }
    })
  }, [])

  useEffect(() => {
    if (current.matches({ loadedSession: 'loadingProfile' })) {
      supabase
        .from('profiles')
        .select(`full_name, company, title, registered`)
        .eq('id', current.context.session.user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.log(error)
            return
          }
          if (!data) {
            console.log('no data')
            return
          }
          setProfile(data)
        })
    }
  }, [current.matches({ loadedSession: 'loadingProfile' })])

  if (current.matches('loadingSession') || current.matches({ loadedSession: 'loadingProfile' })) {
    return <Loading />
  }
  if (current.matches('signedOut')) {
    return <SignIn />
  }
  if (current.matches({ loadedSession: 'loadedProfile' })) {
    return (
      <sessionContext.Provider
        value={{ session: current.context.session, supabase, profile: current.context.profile }}
      >
        {current.matches({ loadedSession: { loadedProfile: 'registered' } }) ? (
          children
        ) : (
          <Registration setProfile={setProfile} />
        )}
      </sessionContext.Provider>
    )
  }
  // should never get here
  return null
}

export const useSessionCtx = () => {
  const ctx = React.useContext(sessionContext)
  if (!ctx) {
    throw new Error('useSessionCtx must be used within a SessionProvider')
  }
  return ctx
}
