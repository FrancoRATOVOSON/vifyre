import fastifyPlugin from 'fastify-plugin'
import { ViteDevServer } from 'vite'

import { env } from '../../config'

type FastifyPluginOptionsType = {
  viteSertver?: ViteDevServer
}

export const vitePlugin = fastifyPlugin<FastifyPluginOptionsType>(
  async (server, { viteSertver: vite }) => {
    if (env.NODE_ENV === 'development' && vite) server.use(vite.middlewares)
  }
)
