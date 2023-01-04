import { Replicache } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { appMutators, AppMutators } from './appMutators'

export const APP_SPACE_ID = 'app'

export const useAppRep = () => {
  return useReplicache<AppMutators>({ name: APP_SPACE_ID, mutators: appMutators })
}

export type AppRep = Replicache<AppMutators>
