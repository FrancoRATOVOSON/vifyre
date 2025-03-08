import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { postsList } from '#/schema/post.schema'
import { getPostList } from '#/services/post.service'

async function posts(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().get(
    '/posts',
    {
      schema: {
        response: {
          200: postsList
        }
      }
    },
    async (_req, rep) => {
      const result = await getPostList(server.prisma)

      if (result.error) throw result.error
      rep.status(200).send(result.data)
    }
  )
}

export default posts
