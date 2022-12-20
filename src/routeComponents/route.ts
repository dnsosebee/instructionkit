import { proxy, useSnapshot } from 'valtio'
import { ROUTE_CONFIG } from '../components/route/handlers/rootHandler'

type UrlSegment = string
type ParamName = string
type ForkName = string

export type ParamSubrouteConfig = {
  paramName: ParamName
  subRoute: ForkSubrouteConfig
}

export type ForkSubrouteConfig = {
  forkName: ForkName
  hasDefaultSubroute?: true
  namedSubroutes?: Record<UrlSegment, ForkSubrouteConfig>
  dynamicSubroute?: ParamSubrouteConfig
}

export type SubrouteConfig = ParamSubrouteConfig | ForkSubrouteConfig

export enum ForkType {
  Named,
  Dynamic,
  Default,
}

type Fork =
  | {
      type: ForkType.Default | ForkType.Dynamic
    }
  | {
      type: ForkType.Named
      urlSegment: UrlSegment
    }

type RouteState = { params: Record<ParamName, string>; forks: Record<ForkName, Fork> }

const forkUrlToRoute = (
  urlSegments: string[],
  forkSubrouteConfig: ForkSubrouteConfig,
  routeState: RouteState,
): RouteState => {
  const [urlSegment, ...restUrlSegments] = urlSegments
  const forkName = forkSubrouteConfig.forkName

  if (urlSegment === undefined) {
    if (forkSubrouteConfig.hasDefaultSubroute) {
      routeState.forks[forkName] = { type: ForkType.Default }
      return routeState
    } else {
      throw new Error('No default subroute')
    }
  }

  if (forkSubrouteConfig.namedSubroutes) {
    const subrouteConfig = forkSubrouteConfig.namedSubroutes[urlSegment]
    if (subrouteConfig) {
      routeState.forks[forkName] = { type: ForkType.Named, urlSegment }
      return forkUrlToRoute(restUrlSegments, subrouteConfig, routeState)
    }
  }

  if (forkSubrouteConfig.dynamicSubroute) {
    routeState.forks[forkName] = { type: ForkType.Dynamic }
    return paramUrlToRoute(urlSegments, forkSubrouteConfig.dynamicSubroute, routeState)
  }

  throw new Error('No matching subroute')
}

const paramUrlToRoute = (
  urlSegments: string[],
  paramSubrouteConfig: ParamSubrouteConfig,
  routeState: RouteState,
): RouteState => {
  const [urlSegment, ...restUrlSegments] = urlSegments
  const paramName = paramSubrouteConfig.paramName

  if (urlSegment === undefined) {
    throw new Error('No param value')
  }

  routeState.params[paramName] = urlSegment
  return forkUrlToRoute(restUrlSegments, paramSubrouteConfig.subRoute, routeState)
}

const urlToRoute = (url: string): RouteState => {
  const routeState: RouteState = { params: {}, forks: {} }

  const urlSegments = url.split('/').filter(segment => segment !== '')

  return forkUrlToRoute(urlSegments, ROUTE_CONFIG, routeState)
}

const globalRoute = proxy<{ state: RouteState }>(undefined)

export const getRoute = (): RouteState => useSnapshot(globalRoute).state

// we should set replace to false if setting the route based on the URL
// we should set replace to true if setting the route based on a user action
export const setRoute = ({ route, replace }: { route: string; replace: boolean }) => {
  if (replace) {
    window.history.pushState({}, '', route)
  }
  globalRoute.state = urlToRoute(route)
}
