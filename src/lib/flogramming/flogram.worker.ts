/* global postMessage */
import { logger as parentLogger } from '../logger'
import { MessageTypes } from './flogramming'

const logger = parentLogger.child({ module: 'worker' })

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AsyncFunction = async function () {}.constructor

export type GenericMessageToWorker<T extends MessageTypes> = {
  type: T
  toEval: string // can have escaped pointy brackets, or not
  context: { [key: string]: unknown }
  declaredIdentifiers: T extends MessageTypes.assign ? string[] : undefined
}

export type MessageToWorker =
  | GenericMessageToWorker<MessageTypes.assign>
  | GenericMessageToWorker<MessageTypes.expression>

export type GenericMessageFromWorker<T extends MessageTypes> = {
  type: T
} & (T extends 'assign' ? { result: { [key: string]: unknown } } : { result: unknown })

export type MessageFromWorker =
  | { result: unknown | { [key: string]: unknown } }
  | { error: unknown }

const assignContextCode = (
  context: { [key: string]: unknown },
  contextArgName = 'context',
): string => {
  logger.debug('assignContextCode', { context })
  return (
    Object.keys(context)
      .map(k => `let ${k} = ${contextArgName}.${k}`)
      .join('; ') + '; const window = undefined;'
  )
}

const retrieveContextCode = (
  context: { [key: string]: unknown },
  declaredIdentifiers: string[],
): string => {
  const keys = Object.keys(context)
  const dedupedIdentifiers = [...new Set([...keys, ...declaredIdentifiers])]
  return `return {${dedupedIdentifiers.map(k => `${k}`).join(', ')}}`
}

const evalExpression = (toEval: string, context: { [key: string]: unknown }): unknown => {
  logger.debug('evalExpression', { toEval, context })
  const code = `${assignContextCode(context)} return ${toEval}`
  logger.debug('evalExpression code', code)
  return Function('context', code)(context)
}

// code blocks go through here: evaluate and assign variables back to context
const evalAssign = async (
  toEval: string,
  context: { [key: string]: unknown },
  declaredIdentifiers: string[],
): Promise<{ [key: string]: unknown }> => {
  logger.debug('evalAssign', { toEval, context })
  const code = ` ${assignContextCode(context)} ${toEval}; ${retrieveContextCode(
    context,
    declaredIdentifiers,
  )}`
  logger.debug('evalAssign code', code)
  return await AsyncFunction('context', code)(context)
}

onmessage = async (e: MessageEvent<MessageToWorker>) => {
  const { toEval, context, type } = e.data
  logger.debug('onmessage', { toEval, context, type })
  const toEvalUnescaped = toEval.replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  let result: MessageFromWorker
  try {
    if (type === 'expression') {
      result = { result: evalExpression(toEvalUnescaped, context) }
    } else if (type === 'assign') {
      result = { result: await evalAssign(toEvalUnescaped, context, e.data.declaredIdentifiers) }
    } else {
      throw new Error(`Unknown type: ${type}`)
    }
  } catch (e: unknown) {
    result = { error: e }
  }
  postMessage(result)
}
