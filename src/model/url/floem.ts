import { z } from 'zod'
import { versionSchema } from '../replicache/spaces/proj/entries/version'

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
