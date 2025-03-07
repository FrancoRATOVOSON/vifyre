import path from 'path'
import { fileURLToPath } from 'url'

import fastifyStatic from '@fastify/static'
import fastifyPlugin from 'fastify-plugin'

import { ViteDevServer } from 'vite'

import { createReactRouterHandler } from './handler'
import { env } from '#/config'

const clientPath = '../../../'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

type FastifyPluginClientOptionsType = {
  viteSertver?: ViteDevServer
}

export const clientLoaderPlugin = fastifyPlugin<FastifyPluginClientOptionsType>(
  async (server, { viteSertver: vite }) => {
    if (env.NODE_ENV === 'production') {
      server.register(fastifyStatic, {
        root: path.resolve(__dirname, clientPath, 'client/assets'),
        prefix: '/assets',
        wildcard: true,
        index: false,
        preCompressed: true,
        decorateReply: false
      })
      server.register(fastifyStatic, {
        root: path.resolve(__dirname, clientPath, 'client/assets'),
        prefix: '/',
        wildcard: false,
        index: false,
        preCompressed: true
      })
    }

    const handler = createReactRouterHandler({
      build: () =>
        env.NODE_ENV === 'production'
          ? import(`${clientPath}/server/index.js`)
          : // @ts-expect-error - virtual module provided by React Router at build time
            vite.ssrLoadModule('virtual:react-router/server-build'),
      getLoadContext: () => ({ someKey: 'someValue' }),
      mode: env.NODE_ENV
    })

    server.get('*', async (request, reply) => {
      try {
        return handler(request, reply)
      } catch (error) {
        vite?.ssrFixStacktrace(error as Error)
        server.log.error(error)
        reply
          .status(500)
          .send((error as Error).message ? (error as Error).message : 'Internal Server Error')
      }
    })
  }
)
