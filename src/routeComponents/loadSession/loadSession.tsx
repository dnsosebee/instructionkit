import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import SignIn from '../../../pages/signin'
import Loading from '../../components/shared/loading'
import { ActionSubroute } from '../route'
import LoadAppRep, { LoadAppRepSubroute } from './loadAppRep/loadAppRep'

export type LoadSessionSubroute = ActionSubroute<{
  name: 'loadSession'
  subRoutes: [LoadAppRepSubroute]
}>

export type LoadSessionProps = {
  route: LoadSessionSubroute
}

export type SessionContext = { session: Session }

export default ({ route }: LoadSessionProps) => {
  const [sessionState, setSessionState] = useState<
    | {
        state: 'LOADING' | 'SIGNED_OUT'
      }
    | {
        state: 'SIGNED_IN'
        session: Session
      }
  >({
    state: 'LOADING',
  })

  const supabase = useSupabaseClient()
  useEffect(() => {
    const updateSessionState = (event: string, session: Session | null) => {
      switch (event) {
        case 'SIGNED_IN':
          setSessionState({ state: event, session: session! })
          break
        case 'SIGNED_OUT':
          setSessionState({ state: event })
          break
      }
    }
    supabase.auth.onAuthStateChange(updateSessionState)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (session) {
        updateSessionState('SIGNED_IN', session)
      } else {
        updateSessionState('SIGNED_OUT', null)
      }
    })
  }, [])

  switch (sessionState.state) {
    case 'LOADING':
      return <Loading />
    case 'SIGNED_OUT':
      return <SignIn />
    default:
      return <LoadAppRep session={sessionState.session} route={route.then} />
  }
}
