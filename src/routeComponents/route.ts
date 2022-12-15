import React from 'react'
import loadSession, { LoadSessionSubroute } from './loadSession/loadSession'

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

export const App = loadSession as React.FC<{ route: Route }>
