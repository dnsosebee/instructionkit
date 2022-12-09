import { customAlphabet } from 'nanoid'
export const ALPHABET = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'

export const genUuid = (uuidLength: number) => () => {
  return customAlphabet(ALPHABET, uuidLength)()
}

export const key = (keyPrefix: string) => (id: string) => `${keyPrefix}/${id}`
