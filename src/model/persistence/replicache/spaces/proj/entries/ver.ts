import { ReadTransaction } from 'replicache'
import { Version, versionSchema } from '../../../../../schema/types/version'
import { key, unkey } from '../../../key'

export const VERSION_KEY_PREFIX = 'ver/'

export const versionKey = key(VERSION_KEY_PREFIX)
const versionUnkey = unkey(VERSION_KEY_PREFIX)

export const listVersions = async (tx: ReadTransaction): Promise<Version[]> => {
  return (await tx.scan({ prefix: VERSION_KEY_PREFIX }).entries().toArray()).map(([k, v]) => {
    return {
      ...versionSchema.parse(v),
      id: versionUnkey(k),
    }
  })
}
