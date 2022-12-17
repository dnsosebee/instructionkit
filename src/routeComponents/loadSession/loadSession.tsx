import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import SignIn from '../../../pages/signin'
import Loading from '../../components/shared/loading'
import { Database } from '../../lib/database.types'
import { ActionSubroute } from '../route'
import LoadAppRep, { LoadAppRepSubroute } from './loadAppRep/loadAppRep'

export type LoadSessionSubroute = ActionSubroute<{
  name: 'loadSession'
  subRoutes: [LoadAppRepSubroute]
}>

export type LoadSessionProps = {
  route: LoadSessionSubroute
}

export type SessionContext = { session: Session, supabase: ReturnType<typeof useSupabaseClient<Database>> }

type LoadSessionState = | {
  sessionState: 'LOADING' | 'SIGNED_OUT'
}
| {
sessionState: 'SIGNED_IN'
  session: Session
  profileLoaded: false
}
| {
  sessionState: 'SIGNED_IN'
  session: Session
  profileLoaded: true
  registered: boolean
  profile: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name' | 'company' | 'title' | 'registered'>
}

export default ({ route }: LoadSessionProps) => {
  const [state, setState] = useState<
    LoadSessionState
  >({
    sessionState: 'LOADING',
  })

  const supabase = useSupabaseClient<Database>()
  useEffect(() => {
    const updateSessionState = (event: string, session: Session | null) => {
      switch (event) {
        case 'SIGNED_IN':
          setState({ sessionState: event, session: session!, profileLoaded: false })
          break
        case 'SIGNED_OUT':
          setState({ sessionState: event,  })
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

  useEffect(() => {
    if (state.sessionState === 'SIGNED_IN') {
      const { data, error } = await supabase
      .from('profiles')
      .select(`full_name, company, title, registered`)
      .eq('id', state.session.user.id)
      .single()
    if (error) {
      console.log(error)
      return
    }
    if (!data) {
      console.log('no data')
      return
    }
    setState({
      sessionState: 'SIGNED_IN',
        session: state.session,
        profileLoaded: true,
        registered: data.registered,
        profile: data,
      })
    }
  }, [state.sessionState])

  switch (state.sessionState) {
    case 'LOADING':
      return <Loading />
    case 'SIGNED_OUT':
      return <SignIn />
  }

  const profile = 

  switch (route.then.do) {
    case 'loadAppRep':
      return <LoadAppRep session={state.session} route={route.then} />
  }
}
