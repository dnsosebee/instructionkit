import { User, useSupabaseClient } from '@supabase/auth-helpers-react'
import { assign, AssignAction, createMachine } from 'xstate'

export type AuthContext = {
  user?: User
}

type SignedInEvent = {
  type: 'SIGNED_IN'
  user: User
}

type SignedOutEvent = {
  type: 'SIGNED_OUT'
}

export const authMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgWWQY0wEsA7MAOgLDwGsSoBBDTAYgGUBJAcQDkBRAEQD67bgG0ADAF1EoAA4B7WIXSF5xGSAAeiAEziAbGXEAWAJzGAHKYDMARmvXxt0wBoQAT0QXbZSwFZ9AHYHWz9rP0DjHQBfaLc0LFwCEnJKGjpGLDYuPiEAeQBVABUJaSQQBSUVNQ1tBD1DE3MrOwcnVw9EW0DAsj8LQJ0-JwsrHWNrGNi3YnkIOA0EnHwiUg1K5VV1crqAWjsyfUdrQNMdU31bcXDAt08EXcbxZ5NbewHA230LaZAlpNWqUwVFoxAYTHWik2NR2XUM1n0Fz0gWuVn0EzuiFM4kOplsOmC4WspgsflMpl+-xWKTISigpAg7G2cih1WZWkQCOsh30TkRb2Mlh0A0xCCuxjI5y5vJ0tkFOmsPzifyYAJpdIZeQwkKqW1qnKOPL5eLlQpFnTFgQsRgGQ3JpIR31isSAA */
  createMachine(
    {
      id: 'authMachine',

      schema: {
        context: {} as AuthContext,
        events: {} as SignedInEvent | SignedOutEvent,
      },
      initial: 'checkingAuth',
      states: {
        checkingAuth: {
          invoke: {
            id: 'checkAuth',
            src: (context, event) => (callback, onReceive) => {
              const supabase = useSupabaseClient()
              supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                  callback({ type: 'SIGNED_IN', user: session!.user })
                }
                if (event === 'SIGNED_OUT') {
                  callback({ type: 'SIGNED_OUT' })
                }
              })
            },
          },

          on: {
            SIGNED_IN: {
              target: 'signedIn',
              actions: 'setUser',
            },
            SIGNED_OUT: {
              target: 'signedOut',
            },
          },
        },

        signedIn: {},
        signedOut: {},
      },
    },
    {
      actions: {
        setUser: assign({
          user: (context, event) => event.user,
        }) as AssignAction<AuthContext, SignedInEvent>,
      },
    },
  )
