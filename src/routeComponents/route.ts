import { proxy } from 'valtio'
import { LoadSessionSubroute } from './loadSession/loadSession'

export type ActionSubroute<
  T extends {
    name: string
    requiresInput?: boolean
    subRoutes?: ActionSubroute<any>[]
  },
> = { do: T['name'] } & (T['requiresInput'] extends true
  ? { withInput: string }
  : { withInput?: undefined }) &
  (T['subRoutes'] extends ActionSubroute<any>[]
    ? {
        then: T['subRoutes'][number]
      }
    : {
        then?: undefined
      })

// type SubrouteSchema = {do: z.ZodLiteral<string>, withInput?: z.ZodString, then?: Action['subrouteSchema']}
// type Action = {
//   subrouteSchema: SubrouteSchema
//   url: (subroute: z.infer<SubrouteSchema>) => string
// }

// export const actionGen = (name:)

export type Route = LoadSessionSubroute

// export const AppRoute =
//   /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqBKB7ArgFzAGIBlACQHkB1AfQDEBBAGUYCF6BhAaWsvI0+IAFDgFEA2gAYAuolCossAJZ5FWAHayQAD0QAWAEwAaEAE9EARgDMATgB01gOwBWfQDZdD69YAclibu8AX2DjNSwIOE00TFwCTXklFXVNHQQAWldjM3TXWwl8gstXS11rAyDA42jsfDBbAFtkACcAazAVNSh4hWVVDSRtPSNTRG9zWwCnVzG3fO9SkJBq2Lro7sS+lL1dLO3x6yddG0tzfSdrfUsHReXa22jbWAALLAB3WmQAG0+AI2QAYxalCwrVgqABYHWvWSA1SF12CBcdl0ujmDncEnM1nMN3QNQI93Qjxer2BoPB-0hAwS0P6oFS5gkDls5lc+mcTjmElcDnMDgRrnO9iKgtcrLc5nOwWCQA */
//   createMachine({
//     id: 'appRoute',

//     states: {
//       marketing: {},
//       app: {
//         states: {
//           showFallbackWorkspace: {},
//           showWorkspace: {},
//         },
//       },
//     },
//     initial: 'marketing',

//     on: {
//       SHOW_FALLBACK_WORKSPACE: 'app.accessFallbackWorkspace'
//     },
//   })

type RouteState =
  | {
      accessFallbackWorkspace: true
    }
  | {
      accessWorkspace: {
        workspaceId: string
      }
    }

export const routeState = proxy<RouteState>(undefined)
