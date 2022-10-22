// this file exists to prevent circular dependencies
// also, make sure not to generate IDs from the mutator: could lead to de-sync'ed client views. We want mutators to be deterministic.
import { customAlphabet } from 'nanoid'

const ALPHABET = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz_'

// floem
export const FLOEM_ID_PREFIX = 'floem-'
export const FLOEM_UUID_LENGTH = 21 // nanoid default length is 21
export const FLOEM_ID_LENGTH = FLOEM_ID_PREFIX.length + FLOEM_UUID_LENGTH
const genFloemUuid = customAlphabet(ALPHABET, FLOEM_UUID_LENGTH)
export const genFloemId = () => FLOEM_ID_PREFIX + genFloemUuid()

// flow
export const FLOW_ID_PREFIX = 'flow-'
export const FLOW_UUID_LENGTH = 5
export const FLOW_START_ID = FLOW_ID_PREFIX + 'start'
export const FLOW_ID_LENGTH = FLOW_ID_PREFIX.length + FLOW_UUID_LENGTH
const genFlowUuid = customAlphabet(ALPHABET, FLOW_UUID_LENGTH)
export const genFlowId = () => FLOW_ID_PREFIX + genFlowUuid()

// dart
export const DART_ID_PREFIX = 'dart-'
export const DART_UUID_LENGTH = 5
export const DART_ID_LENGTH = DART_ID_PREFIX.length + DART_UUID_LENGTH
const genDartUuid = customAlphabet(ALPHABET, DART_UUID_LENGTH)
export const genDartId = () => DART_ID_PREFIX + genDartUuid()

// rotates through nanoid uuids to prevent collisions
// might overflow if given a long ID, intending to only use for flow and dart IDs
export const nextId = (id: string, uuidLength: number) => {
  const uuid = id.slice(-uuidLength)
  const num = idToNumber(uuid)
  const nextNum = (num + 1) % Math.pow(ALPHABET.length, uuidLength)
  const nextUuid = numberToId(nextNum)
  return id.slice(0, -uuidLength) + nextUuid
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
