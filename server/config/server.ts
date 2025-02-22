import fastify from 'fastify'

import env from './env'
import logger from './logger'

export function createServer() {
  const server = fastify({
    logger: env.NODE_ENV === 'test' ? false : logger
  })

  return server
}
