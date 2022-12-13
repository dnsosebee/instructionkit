import { customAlphabet } from 'nanoid'
export const ALPHABET = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'

export const genId = (idLength: number) => () => {
  return customAlphabet(ALPHABET, idLength)()
}

export const key = (keyPrefix: string) => (id: string) => `${keyPrefix}${id}`

export const id = (keyPrefix: string) => (key: string) => {
  if (!key.startsWith(keyPrefix)) {
    throw new Error(`Key ${key} does not start with ${keyPrefix}`)
  }
  return key.substring(keyPrefix.length)
}

export const splitKey = (key: string) => {
  const slashIndex = key.indexOf('/')
  if (slashIndex === -1) {
    throw new Error(`Key ${key} missing a slash`)
  }
  return {
    keyPrefix: key.substring(0, slashIndex),
    rest: key.substring(slashIndex + 1),
  }
}

export const scopedKey = (keyPrefix: string) => (parent: string, id: string) =>
  `${keyPrefix}${parent}/${id}`

export const scopedIds = (keyPrefix: string) => (key: string) => {
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
    id: id.substring(slashIndex + 1),
  }
}

// rotates through nanoid uuids to prevent collisions
// might overflow if given a long ID, intending to only use for flow and dart IDs
export const nextId = (id: string) => {
  const num = idToNumber(id)
  const nextNum = (num + 1) % Math.pow(ALPHABET.length, id.length)
  return numberToId(nextNum)
}

const idToNumber = (id: string): number => {
  let sum = 0
  for (let i = 0; i < id.length; i++) {
    const char = id[i]
    const index = ALPHABET.indexOf(char)
    sum += index * Math.pow(ALPHABET.length, id.length - i - 1)
  }
  return sum
}

const numberToId = (num: number): string => {
  let id = ''
  while (num > 0) {
    const index = num % ALPHABET.length
    id = ALPHABET[index] + id
    num = Math.floor(num / ALPHABET.length)
  }
  return id
}
