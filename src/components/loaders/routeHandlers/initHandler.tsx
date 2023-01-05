import { ForkSubrouteConfig, getRoute } from '../../../lib/route/route'
import { urlDecodeFloem } from '../../../model/persistence/url'
import Loading from '../../views/shared/loading'
import { useProjectCtx } from '../providers/projectProvider'

export const INTERNAL_INIT_ROUTE_CONFIG: ForkSubrouteConfig = {
  forkName: 'init',
  dynamicSubroute: {
    paramName: 'floem',
    subroute: {
      forkName: 'floem',
      hasDefaultSubroute: true,
    },
  },
}

export const InitHandler = () => {
  const { floem } = getRoute().params
  const { initProject } = useProjectCtx()
  initProject({ ...urlDecodeFloem(floem), onlyIfEmpty: false })
  return <Loading />
}
