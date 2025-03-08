import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import api from './api'
import client from './client'

const router = async (fastify: FastifyInstance) => {
  await fastify.register(api, {
    prefix: '/api'
  })

  await fastify.register(client)
}

export default fastifyPlugin(router)
