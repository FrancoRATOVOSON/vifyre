import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import client from './client'

const customPlugins = async (fastify: FastifyInstance) => {
  await fastify.register(client)
}

export default fastifyPlugin(customPlugins)
