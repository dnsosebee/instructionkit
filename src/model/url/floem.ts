import { z } from 'zod'
import { genDartId } from '../replicache/spaces/proj/entries/dart/dart'
import { GOTO_DART_TYPE } from '../replicache/spaces/proj/entries/dart/types/goto'
import { genFlowId } from '../replicache/spaces/proj/entries/flow/flow'
import { BRANCH_FLOW_TYPE } from '../replicache/spaces/proj/entries/flow/types/branch'
import { START_FLOW_TYPE } from '../replicache/spaces/proj/entries/flow/types/start'
import { genVersionId, versionSchema } from '../replicache/spaces/proj/entries/version'
import { DEFAULT_HANDLE_ID } from '../tiptap/flowtextExtension'

const floemSchema = versionSchema.extend({
  title: z.string(),
  schemaVersion: z.literal(1),
})

export type Floem = z.infer<typeof floemSchema>

export const urlEncodeFloem = (floem: Floem) => {
  switch (floem.schemaVersion) {
    case 1:
      return encodeURIComponent(JSON.stringify(floem))
    default:
      throw new Error(`Unknown schema version: ${floem.schemaVersion}`)
  }
}

export const urlDecodeFloem = (floem: string): Floem => {
  const decoded = JSON.parse(decodeURIComponent(floem))
  switch (decoded.schemaVersion) {
    case 1:
      return floemSchema.parse(decoded)
    default:
      throw new Error(`Unknown schema version: ${decoded.schemaVersion}`)
  }
}

export const genDefaultFloem = (): Floem => {
  const startId = genFlowId()
  const branchId = genFlowId()
  return {
    id: genVersionId(),
    flows: [
      {
        id: startId,
        type: START_FLOW_TYPE,
        position: { x: 50, y: 50 },
      },
      {
        id: branchId,
        type: BRANCH_FLOW_TYPE,
        position: { x: 100, y: 200 },
        flowtext: '<h1>My Beautiful New Guide</h1><p>Let’s get started!...</p>',
      },
    ],
    darts: [
      {
        id: genDartId(),
        type: GOTO_DART_TYPE,
        from: startId,
        case: DEFAULT_HANDLE_ID,
        to: branchId,
      },
    ],
    createdAt: Date.now(),
    title: 'Blank project',
    schemaVersion: 1,
  }
}
