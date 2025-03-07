import fastifyRateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { autoConfig } from './rate-limit'

const externalPlugin = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyRateLimit, autoConfig(fastify))
}

export default fastifyPlugin(externalPlugin)
