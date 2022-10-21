import pino from 'pino'

export const logger = pino({
  level: 'debug',
  browser: {
    asObject: false,
  },
})

export const { debug, info, warn, error } = logger
