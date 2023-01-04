import { z } from 'zod'
import { HANDLE_ID_LENGTH } from '../../../postProcess/flowtext/nodes/flowtextExtension'
import { genId } from '../../id'
import { FLOW_ID_LENGTH } from '../flow/baseFlow'

export const DART_ID_LENGTH = 5
export const genDartId = genId(DART_ID_LENGTH)

export const baseDartSchema = z.object({
  from: z.string().length(FLOW_ID_LENGTH),
  case: z.string().length(HANDLE_ID_LENGTH),
  to: z.string().length(FLOW_ID_LENGTH),
  id: z.string().length(DART_ID_LENGTH),
})
