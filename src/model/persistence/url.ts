import { Floem, floemSchema } from '../schema/types/floem'

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
