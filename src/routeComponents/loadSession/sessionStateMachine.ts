import { Session } from '@supabase/auth-helpers-react'
import { assign, createMachine } from 'xstate'
import { Database } from '../../lib/database.types'

const sessionStateMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzrAlgewHYGUAuAhnmAHQA2GBEkOqmWAxDgJIDiAcgKIAiA+gPIBVACoBtAAwBdRKAAOGdHnoyQAD0QBWABwAmEjo0A2DQEYdWgJwBmLVasmANCACeiK4YDsJLVu0AWdwsPK3ELTwBfcKcUWHRsfCJSCioaOmxySgg0LCgABQAnDAAzNDIwBgAlTlZmHGFOKu4JaSQQeUVlVvUEDw8TEg9TDR0RwzH-J1cEDWsSE3EdAMWrDSsDK0jotNxCYgyUiFpY+n2snILi0vLBdiqauoaeZpV2tCVsFW6rDwsBv2CwoYdGENAFDJNEIN+nYdCZvotBuI-IZNiAYnEdolTqljulktQIBcSmUSABXLD5MBQNCwYiUiCVaq1eqNZ6tV7vLCfTQWDTeBbiQzib7iSymCEIeahEgWeZmUEhYIRKJo7YJPboKBYSD8Ul4JhsLh8ZjsNlyBRvTqgbo6cT9PyrOE6b6grT-cEuRC2Kz6PxaQwWZG20UaDSo9H0dVJTLZKBHDEGjg8Xgms1tC2c7nTHQS+buEgacS9ax+B3IsMqiPxXbRqix+P0RNGgQiNMcq1qRC2wwDWVjFZ276DDwSrT23yGLTiQUWadWB2RFVYDDUeCtKuY4gvDMd7oAWg9Uz3fIsp9PMzCfQCSPDapr2MO223HQ+XTc9j+ALGwOMYIlpb0SwFnsAc-UMEwKy2XFN1rAkGzxGNzkKYkwGfS1X2tNxLBIQUbHEGZQg8f4c09aZehIdwp3GQsrF5W9oKjB94KwB8iSuNDMzfBA-DtHDDDwgigmI0dBhIJZgUWIIzBRSs7yxfEcQxVjkKuEhKWpWkwHpDjd0hUwC0sXRZUFPwTAsLRcyRcQxMMAJhhscw1g8eiMUYhTH2g5TLhJcl1JpOlIB0jDO24vxflwqdBKIjwSKmPMfVhcCDBMFKZhsFzI3vTVtQgXU8CCrkuLS7wVkc-41hGCUdA8ayTHA-4ZiojQPBkqDXPvfF6yfdkd2C7o-Fir0tDE6dwJMSwatBYxF3CIA */
  createMachine(
    {
      tsTypes: {} as import('./sessionStateMachine.typegen').Typegen0,
      schema: {
        context: {} as {
          session: Session | null
          profile: Pick<
            Database['public']['Tables']['profiles']['Row'],
            'registered' | 'full_name' | 'company' | 'title'
          > | null
        },
        events: {} as
          | {
              type: 'SIGNED_IN'
              session: Session
            }
          | {
              type: 'SIGNED_OUT'
            }
          | {
              type: 'REGISTERED'
              profile: Pick<
                Database['public']['Tables']['profiles']['Row'],
                'registered' | 'full_name' | 'company' | 'title'
              >
            }
          | {
              type: 'UNREGISTERED'
              profile: Pick<
                Database['public']['Tables']['profiles']['Row'],
                'registered' | 'full_name' | 'company' | 'title'
              >
            },
      },
      initial: 'loadingSession',
      id: 'sessionState',

      context: {
        session: null,
        profile: null,
      },

      states: {
        loadedSession: {
          entry: 'setSession',
          initial: 'loadingProfile',

          states: {
            loadingProfile: {
              on: {
                REGISTERED: 'loadedProfile.registered',

                UNREGISTERED: 'loadedProfile.unregistered',
              },
            },

            loadedProfile: {
              states: {
                registered: {},
                unregistered: {
                  on: {
                    REGISTERED: {
                      target: 'registered',
                      actions: 'setProfile',
                    },
                  },
                },
              },
              entry: 'setProfile',
            },
          },

          on: {
            SIGNED_OUT: 'signedOut',
          },
        },

        signedOut: {
          on: {
            SIGNED_IN: 'loadedSession',
          },
        },

        loadingSession: {
          on: {
            SIGNED_IN: 'loadedSession',
            SIGNED_OUT: 'signedOut',
          },
        },
      },
    },
    {
      actions: {
        setSession: assign({
          session: (_, event) => event.session,
        }),
        setProfile: assign({
          profile: (_, event) => event.profile,
        }),
      },
    },
  )
