import { Map } from 'immutable'
import { logger as parentLogger } from '../../../../lib/logger'
import { GenericMessageToWorker, MessageFromWorker, MessageToWorker } from './flogram.worker'
import { getDeclaredIdentifiers } from './parse'

const logger = parentLogger.child({ module: 'flogramming' })

export enum MessageTypes {
  expression = 'expression',
  assign = 'assign',
}

const getWorkerResponse = async (messageToWorker: MessageToWorker) => {
  logger.debug('getWorkerResponse', { messageToWorker })
  const worker = new Worker(new URL('./flogram.worker.ts', import.meta.url), {
    type: 'module',
  })
  const messageFromWorker = await new Promise<MessageFromWorker>(resolve => {
    worker.onmessage = event => {
      resolve(event.data)
    }
    worker.postMessage(messageToWorker)
  })
  if ('error' in messageFromWorker) {
    throw messageFromWorker.error
  }
  return messageFromWorker.result
}

const evalExpression = async (toEval: string, context: Map<string, unknown>): Promise<unknown> => {
  // module import from flogram.ts

  const messageToWorker: GenericMessageToWorker<MessageTypes.expression> = {
    toEval,
    context: context.toJS(),
    type: MessageTypes.expression,
    declaredIdentifiers: undefined,
  }
  return await getWorkerResponse(messageToWorker)
}

// returns boolean indicating whether the condition is true in the context
export const evalCondition = async (
  condition: string,
  context: Map<string, unknown>,
): Promise<boolean> => {
  return (await evalExpression(`!!(${condition})`, context)) as boolean
}

export const evalAssignments = async (
  toEval: string,
  context: Map<string, unknown>,
): Promise<Map<string, unknown>> => {
  logger.debug('evalAssignments', { toEval, context })
  const messageToWorker: GenericMessageToWorker<MessageTypes.assign> = {
    type: MessageTypes.assign,
    toEval,
    context: context.toJS(),
    declaredIdentifiers: getDeclaredIdentifiers(toEval),
  }
  logger.debug('evalAssignments messageToWorker', messageToWorker)
  const result = (await getWorkerResponse(messageToWorker)) as { [key: string]: unknown }
  if (!(result instanceof Object)) {
    throw new Error(`Expected result to be an object, got ${result}`)
  }
  return Map(result)
}
