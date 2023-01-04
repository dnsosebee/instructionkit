export const key = (keyPrefix: string) => (id: string) => `${keyPrefix}${id}`

export const unkey = (keyPrefix: string) => (key: string) => {
  if (!key.startsWith(keyPrefix)) {
    throw new Error(`Key ${key} does not start with ${keyPrefix}`)
  }
  return key.substring(keyPrefix.length)
}

export const scopedKey = (keyPrefix: string) => (parent: string, child: string) =>
  `${keyPrefix}${parent}/${child}`

export const scopedUnkey = (keyPrefix: string) => (key: string) => {
  if (!key.startsWith(keyPrefix)) {
    throw new Error(`Key ${key} does not start with ${keyPrefix}`)
  }
  const id = key.substring(keyPrefix.length)
  const slashIndex = id.indexOf('/')
  if (slashIndex === -1) {
    throw new Error(`Key ${key} missing a slash`)
  }
  return {
    parent: id.substring(0, slashIndex),
    child: id.substring(slashIndex + 1),
  }
}
