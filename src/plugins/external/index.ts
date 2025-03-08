import fastifyRateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { autoConfig } from './rate-limit'
import pluginRoute from './routes'

const externalPlugin = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyRateLimit, autoConfig(fastify))
  await fastify.register(pluginRoute)
}

export default fastifyPlugin(externalPlugin)
