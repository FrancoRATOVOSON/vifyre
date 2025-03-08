import { FastifyInstance } from 'fastify'

import custom from './plugins/custom'
import external from './plugins/external'
import router from './router'

export async function createApp(fastify: FastifyInstance) {
  /**
   * ******************************************************************************
   * 'Till https://github.com/fastify/fastify-autoload/issues/404 is resolved
   * We cannot use `@fastify/autoload` within `@swc-node/register`
   * So we are doing the registering manually for now
   */

  // await fastify.register(fastifyAutoload, {
  //   dir: path.join(import.meta.dirname, 'plugins/external'),
  //   options: { ...opts }
  // })

  // await fastify.register(fastifyAutoload, {
  //   dir: path.join(import.meta.dirname, 'plugins/customl'),
  //   options: { ...opts }
  // })

  // await fastify.register(fastifyAutoload, {
  //   dir: path.join(import.meta.dirname, 'routes'),
  //   autoHooks: true,
  //   cascadeHooks: true,
  //   options: { ...opts }
  // })

  /* ******************************************************************************* */

  await fastify.register(external)
  await fastify.register(custom)
  await fastify.register(router)

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params
        }
      },
      'Unhandled error occurred'
    )
    reply.code(err.statusCode ?? 500)
    let message = 'Internal Server Error'
    if (err.statusCode && err.statusCode < 500) {
      message = err.message
    }
    return { message }
  })

  // An attacker could search for valid URLs if your 404 error handling is not rate limited.
  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 3,
        timeWindow: 500
      })
    },
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params
          }
        },
        'Resource not found'
      )
      reply.code(404)
      return { message: 'Not Found' }
    }
  )
}
