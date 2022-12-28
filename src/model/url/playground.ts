import { z } from 'zod'
import { versionSchema } from '../replicache/spaces/proj/entries/version'

const playgroundSchema = versionSchema.extend({
  title: z.string(),
  schemaVersion: z.literal(1),
})

export type Playground = z.infer<typeof playgroundSchema>

export const urlEncodePlayground = (playground: Playground) => {
  switch (playground.schemaVersion) {
    case 1:
      return encodeURIComponent(JSON.stringify(playground))
    default:
      throw new Error(`Unknown schema version: ${playground.schemaVersion}`)
  }
}

export const urlDecodePlayground = (playground: string): Playground => {
  const decoded = JSON.parse(decodeURIComponent(playground))
  switch (decoded.schemaVersion) {
    case 1:
      return playgroundSchema.parse(decoded)
    default:
      throw new Error(`Unknown schema version: ${decoded.schemaVersion}`)
  }
}
