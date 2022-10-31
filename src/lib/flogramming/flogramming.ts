import { Map } from 'immutable'
import { logger as parentLogger } from '../../logger'
import { MessageFromWorker, MessageToWorker } from './flogramWorker'

const logger = parentLogger.child({ module: 'flogramming' })

const getWorkerResponse = async (messageToWorker: MessageToWorker) => {
  const worker = new Worker(new URL('./flogramWorker.ts', import.meta.url), {
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

  const messageToWorker: MessageToWorker = {
    toEval,
    context: context.toJS(),
    type: 'expression',
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
  const messageToWorker: MessageToWorker = {
    toEval,
    context: context.toJS(),
    type: 'assign',
  }
  const result = await getWorkerResponse(messageToWorker)
  if (!(result instanceof Object)) {
    throw new Error(`Expected result to be an object, got ${result}`)
  }
  return Map(result)
}
