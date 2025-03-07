import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { clientLoaderPlugin } from './client-loader'
import { viteLoaderPlugin } from './vite'
import { createViteMiddleWare } from '#/middlewares/vite'

const clientPlugin = async (server: FastifyInstance) => {
  const vite = await createViteMiddleWare()

  await server.register(import('@fastify/middie'))

  server.register(viteLoaderPlugin, { viteSertver: vite })
  server.register(clientLoaderPlugin, { viteSertver: vite })
}
export default fastifyPlugin(clientPlugin)
