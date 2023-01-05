import { NextApiRequest, NextApiResponse } from 'next'
import { handleRequest } from 'replicache-nextjs/lib/backend'
import { appMutators } from '../../../src/model/persistence/replicache/spaces/app/appMutators'
import { APP_SPACE_ID } from '../../../src/model/persistence/replicache/spaces/app/appRep'
import { projectMutators } from '../../../src/model/persistence/replicache/spaces/proj/projectMutators'
import {
  projectSpaceIdSchema,
  PROJECT_SPACE_ID_PREFIX,
} from '../../../src/model/persistence/replicache/spaces/proj/projectRep'
import { workspaceMutators } from '../../../src/model/persistence/replicache/spaces/ws/workspaceMutators'
import {
  workspaceSpaceIdSchema,
  WORKSPACE_SPACE_ID_PREFIX,
} from '../../../src/model/persistence/replicache/spaces/ws/workspaceRep'

// Next.js runs this function server-side when /api/replicache/[anything].ts is
// requested.
//
// We delegate all such requests to replicache-nextjs which implements the
// server-side of our protocol.
//
// The important thing to notice here is that we pass in `mutators` - our map
// of Replicache mutator functions. These same functions are *also* used on the
// client-side (see [id].tsx). The mutators are run on both the client and the
// server as part of the sync protocol. See mutators.ts for more information.

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { spaceID } = req.query
  if (typeof spaceID === 'string') {
    if (spaceID === APP_SPACE_ID) {
      await handleRequest(req, res, appMutators)
    } else if (spaceID.startsWith(WORKSPACE_SPACE_ID_PREFIX)) {
      workspaceSpaceIdSchema.parse(spaceID)
      await handleRequest(req, res, workspaceMutators)
    } else if (spaceID.startsWith(PROJECT_SPACE_ID_PREFIX)) {
      projectSpaceIdSchema.parse(spaceID)
      await handleRequest(req, res, projectMutators)
    } else {
      return res.status(400).json({ error: 'invalid spaceID' })
    }
  } else {
    return res.status(400).json({ error: 'spaceID must be a string' })
  }
}
