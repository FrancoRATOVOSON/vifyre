import { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import auth from './auth'
import posts from './posts'

const apiRoutePlugin = async (fastify: FastifyInstance) => {
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  await fastify.register(auth, {
    prefix: '/auth'
  })
  await fastify.register(posts)
}

export default apiRoutePlugin
