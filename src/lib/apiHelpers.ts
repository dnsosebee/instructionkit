import { z } from 'zod'
import { WORKSPACE_ID_LENGTH } from '../model/replicache/spaces/app/entries/ws'
import { PROJECT_ID_LENGTH } from '../model/replicache/spaces/ws/entries/proj'
import { logger as parentLogger } from './logger'

const logger = parentLogger.child({ module: 'apiHelpers' })

export const createRepBodySchema = z.union([
  z.object({
    type: z.literal('workspace'),
    workspaceId: z.string().length(WORKSPACE_ID_LENGTH),
  }),
  z.object({
    type: z.literal('project'),
    workspaceId: z.string().length(WORKSPACE_ID_LENGTH),
    projectId: z.string().length(PROJECT_ID_LENGTH),
  }),
])

export type CreateRepBody = z.infer<typeof createRepBodySchema>

export const createRepApiHelper = async (body: CreateRepBody) => {
  const response = await fetch(`/api/replicache/createRep`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const json = await response.json()
  logger.info(json)
  return json
}
