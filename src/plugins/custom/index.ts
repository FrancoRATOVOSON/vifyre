import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import prisma from './prisma'

const customPlugins = async (fastify: FastifyInstance) => {
  await fastify.register(prisma)
}

export default fastifyPlugin(customPlugins)
