import { z } from 'zod'
import { DEFAULT_HANDLE_ID } from '../../postProcess/flowtext/nodes/flowtextExtension'
import { genDartId } from './dart/baseDart'
import { GOTO_DART_TYPE } from './dart/types/goto'
import { genFlowId } from './flow/baseFlow'
import { BRANCH_FLOW_TYPE } from './flow/types/branch'
import { START_FLOW_TYPE } from './flow/types/start'
import { genVersionId, versionSchema } from './version'

// WARNING: this could probably be combined with "Version" type

export const floemSchema = versionSchema.extend({
  title: z.string(),
})

export type Floem = z.infer<typeof floemSchema>

/**
 *
 */

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
