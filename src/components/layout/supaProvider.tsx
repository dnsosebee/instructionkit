import { Session, SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import React, { createContext, useEffect, useState } from 'react'
import Loading from '../shared/loading'
import Redirect from '../shared/redirect'

export enum AuthState {
  Loading,
  SignedIn,
  SignedOut,
}

type Auth =
  | {
      state: AuthState.SignedIn
      session: Session
    }
  | {
      state: AuthState.SignedOut
    }
  | {
      state: AuthState.Loading
    }

export type SupaAuthedContext = {
  supabase: SupabaseClient
  session: Session
  user: Session['user']
}

export type SupaAnonContext = {
  supabase: SupabaseClient
}

const supaAuthedContext = createContext<SupaAuthedContext | null>(null)

const supaAnonContext = createContext<SupaAnonContext | null>(null)

export default ({
  intendedAuthState,
  children,
}: {
  intendedAuthState: AuthState.SignedIn | AuthState.SignedOut
  children: React.ReactNode
}) => {
  const supabase = useSupabaseClient()
  const [auth, setAuth] = useState<Auth>({
    state: AuthState.Loading,
  })

  // maybe unnecessary due to the above "onAuthStateChange" listener
  useEffect(() => {
    async function checkSession() {
      if (supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          setAuth({ state: AuthState.SignedIn, session })
        } else {
          setAuth({ state: AuthState.SignedOut })
        }
      }
    }
    checkSession()
  }, [supabase])

  if (!supabase || auth.state === AuthState.Loading) {
    return <Loading />
  }

  if (auth.state === AuthState.SignedIn) {
    if (intendedAuthState === AuthState.SignedIn) {
      return (
        <supaAuthedContext.Provider
          value={{ supabase, session: auth.session, user: auth.session.user }}
        >
          {children}
        </supaAuthedContext.Provider>
      )
    }
    return <Redirect to='/app' />
  }

  if (auth.state === AuthState.SignedOut) {
    if (intendedAuthState === AuthState.SignedOut) {
      return <supaAnonContext.Provider value={{ supabase }}>{children}</supaAnonContext.Provider>
    }
  }

  return <Redirect to='/signin' />
}

// assumptions for use: user is not signed in
export const useSupaAnon = () => {
  const supa = React.useContext(supaAnonContext)
  if (!supa) {
    throw new Error('useSupaAnon must be used within a SupaAnonProvider')
  }
  return supa
}

// assumptions for use: user is signed in
export const useSupaAuthed = () => {
  const supa = React.useContext(supaAuthedContext)
  if (!supa) {
    throw new Error('useSupaAuthed must be used within a SupaAuthedProvider')
  }
  return supa
}
