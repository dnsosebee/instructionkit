/*global console*/
/*global postMessage*/
/*global self*/
import { logger as parentLogger } from './logger'

const { debug } = parentLogger.child({ file: 'flogram.ts' })

export interface ToWorker {
  vars: { [key: string]: any }
  flogram: string
}

export interface FlogramWorker extends Worker {
  postMessage(message: ToWorker): void
}

onmessage = function (e: MessageEvent<ToWorker>) {
  debug('onmessage', e.data)
  const { vars, flogram } = e.data
  const selfy = self as { [key: string]: any }
  debug('setting global vars...')
  Object.entries(vars).forEach(([key, value]) => {
    selfy[key] = value
    debug('set', key, value)
  })
  debug('done setting global vars.')
  debug(`Worker: flogram = ${flogram}`)
  debug('selfy', selfy)

  eval(flogram)

  // should get all assigned global variables, including the ones that came from the varsObject, and new ones assigned in the flogram
  // code below adapted from https://stackoverflow.com/a/52693392
  const validEntries = Object.entries(selfy).filter(
    ([key, value]) =>
      typeof value !== 'function' &&
      Object.entries(Object.getOwnPropertyDescriptor(self, key)!).filter(
        e => ['value', 'writable', 'enumerable', 'configurable'].includes(e[0]) && e[1],
      ).length === 4,
  )
  debug('validEntries', validEntries)
  self.postMessage(validEntries)
}
