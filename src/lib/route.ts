import { proxy, useSnapshot } from 'valtio'
import { ROUTE_CONFIG } from '../components/loaders/routesHandlers/rootHandler'
import { logger as parentLogger } from './logger'

const logger = parentLogger.child({ module: 'route.ts' })

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
  Default = 'default',
  Named = 'named',
  Dynamic = 'dynamic',
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

const route = proxy<{ state: RouteState }>(undefined)

export const getRoute = (): RouteState => useSnapshot(route).state

// we should set replace to false if setting the route based on the URL
// we should set replace to true if setting the route based on a user action
export const setRoute = ({ route: relativeUrl, replace }: { route: string; replace: boolean }) => {
  logger.debug('setRoute', { relativeUrl, replace })
  if (replace) {
    window.history.pushState({}, '', relativeUrl)
  }
  const routeState = urlToRoute(relativeUrl)
  logger.info('setRoute', { routeState })
  route.state = routeState
}
