import { urlEncodeFloem } from '../../model/persistence/url'
import { Floem } from '../../model/schema/types/floem'
import { setRoute } from './route'

export const initProject = (workspaceId: string, projectId: string, floem: Floem) => {
  setRoute({ route: `/${workspaceId}/${projectId}/init/${urlEncodeFloem(floem)}`, action: 'none' })
}
