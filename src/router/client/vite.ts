import fastifyPlugin from 'fastify-plugin'

import { ViteDevServer } from 'vite'

import { env } from '#/config'

type ViteLoaderPluginOptionsType = {
  viteSertver?: ViteDevServer
}

export const viteLoaderPlugin = fastifyPlugin<ViteLoaderPluginOptionsType>(
  async (server, { viteSertver: vite }) => {
    if (env.NODE_ENV === 'development' && vite) server.use(vite.middlewares)
  }
)
