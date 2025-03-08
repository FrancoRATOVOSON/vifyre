import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import createLoginRoute from './login.route'

async function auth(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route(createLoginRoute(fastify))
}

export default auth
