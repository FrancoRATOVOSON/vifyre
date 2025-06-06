import fastifyRateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'

export const autoConfig = (_fastify: FastifyInstance) => {
  return {
    max: 100,
    timeWindow: '1 minute'
  }
}

/**
 * This plugins is low overhead rate limiter for your routes.
 *
 * @see {@link https://github.com/fastify/fastify-rate-limit}
 */
export default fastifyRateLimit
