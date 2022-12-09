// this file exists to prevent circular dependencies
// also, make sure not to generate IDs from the mutator: could lead to de-sync'ed client views. We want mutators to be deterministic.
import { customAlphabet } from 'nanoid'

export const CUSTOM_ALPHABET = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'

// floem
export const FLOEM_ID_PREFIX = 'floem-'
export const FLOEM_UUID_LENGTH = 21 // nanoid default length is 21
export const FLOEM_ID_LENGTH = FLOEM_ID_PREFIX.length + FLOEM_UUID_LENGTH
const genFloemUuid = customAlphabet(CUSTOM_ALPHABET, FLOEM_UUID_LENGTH)
export const genFloemId = () => FLOEM_ID_PREFIX + genFloemUuid()

// flow
export const FLOW_ID_PREFIX = 'flow-'
export const FLOW_UUID_LENGTH = 5
export const FLOW_START_ID = FLOW_ID_PREFIX + 'start'
export const FLOW_ID_LENGTH = FLOW_ID_PREFIX.length + FLOW_UUID_LENGTH
const genFlowUuid = customAlphabet(CUSTOM_ALPHABET, FLOW_UUID_LENGTH)
export const genFlowId = () => FLOW_ID_PREFIX + genFlowUuid()

// case
export const CASE_ID_PREFIX = 'case-'
export const CASE_UUID_LENGTH = 5
export const CASE_DEFAULT_ID = CASE_ID_PREFIX + 'dfalt'
export const CASE_ID_LENGTH = CASE_ID_PREFIX.length + CASE_UUID_LENGTH
const genCaseUuid = customAlphabet(CUSTOM_ALPHABET, CASE_UUID_LENGTH)
export const genCaseId = () => CASE_ID_PREFIX + genCaseUuid()

// dart
export const DART_ID_PREFIX = 'dart-'
export const DART_UUID_LENGTH = 5
export const DART_ID_LENGTH = DART_ID_PREFIX.length + DART_UUID_LENGTH
const genDartUuid = customAlphabet(CUSTOM_ALPHABET, DART_UUID_LENGTH)
export const genDartId = () => DART_ID_PREFIX + genDartUuid()

// project
export const PROJECT_ID_PREFIX = 'project-'
export const PROJECT_UUID_LENGTH = 21
export const PROJECT_ID_LENGTH = PROJECT_ID_PREFIX.length + PROJECT_UUID_LENGTH
const genProjectUuid = customAlphabet(CUSTOM_ALPHABET, PROJECT_UUID_LENGTH)
export const genProjectId = () => PROJECT_ID_PREFIX + genProjectUuid()

// live version
export const DEPLOYMENT_ID_PREFIX = 'deployment-'
export const DEPLOYMENT_UUID_LENGTH = 21
export const DEPLOYMENT_ID_LENGTH = DEPLOYMENT_ID_PREFIX.length + DEPLOYMENT_UUID_LENGTH
const genDeploymentUuid = customAlphabet(CUSTOM_ALPHABET, DEPLOYMENT_UUID_LENGTH)
export const genDeploymentId = () => DEPLOYMENT_ID_PREFIX + genDeploymentUuid()

// rotates through nanoid uuids to prevent collisions
// might overflow if given a long ID, intending to only use for flow and dart IDs
export const nextId = (id: string, uuidLength: number) => {
  const uuid = id.slice(-uuidLength)
  const num = idToNumber(uuid)
  const nextNum = (num + 1) % Math.pow(CUSTOM_ALPHABET.length, uuidLength)
  const nextUuid = numberToId(nextNum)
  return id.slice(0, -uuidLength) + nextUuid
}

const idToNumber = (id: string): number => {
  let sum = 0
  for (let i = 0; i < id.length; i++) {
    const char = id[i]
    const index = CUSTOM_ALPHABET.indexOf(char)
    sum += index * Math.pow(CUSTOM_ALPHABET.length, id.length - i - 1)
  }
  return sum
}

const numberToId = (num: number): string => {
  let id = ''
  while (num > 0) {
    const index = num % CUSTOM_ALPHABET.length
    id = CUSTOM_ALPHABET[index] + id
    num = Math.floor(num / CUSTOM_ALPHABET.length)
  }
  return id
}
