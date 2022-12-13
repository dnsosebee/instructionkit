import { useMachine } from '@xstate/react'
import { createMachine } from 'xstate'

export const routeMachine = createMachine({
  id: 'routeMachine',
  initial: 'landing',
  states: {
    landing: {},
    signIn: {},
    User: {
      initial: 'profile',
      states: {
        profile: {},
        AppRep: {
          initial: 'noWorkspaceid',
          states: {
            noWorkspaceid: {},
            workspaceId: {},
          },
        },
      },
    },
  },
})

const [current, send] = useMachine(routeMachine)
send()
