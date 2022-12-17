// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    delays: never
    guards: never
    services: never
  }
  eventsCausingActions: {
    setProfile: 'REGISTERED' | 'UNREGISTERED'
    setSession: 'SIGNED_IN'
  }
  eventsCausingDelays: {}
  eventsCausingGuards: {}
  eventsCausingServices: {}
  matchesStates:
    | 'loadedSession'
    | 'loadedSession.loadedProfile'
    | 'loadedSession.loadedProfile.registered'
    | 'loadedSession.loadedProfile.unregistered'
    | 'loadedSession.loadingProfile'
    | 'loadingSession'
    | 'signedOut'
    | {
        loadedSession?:
          | 'loadedProfile'
          | 'loadingProfile'
          | { loadedProfile?: 'registered' | 'unregistered' }
      }
  tags: never
}
