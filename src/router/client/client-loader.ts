import path from 'path'
import { fileURLToPath } from 'url'

import fastifyStatic from '@fastify/static'
import fastifyPlugin from 'fastify-plugin'

import { ViteDevServer } from 'vite'

import { env } from '#/config'

const clientPath = '../../'
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

    server.get('*', async (request, reply) => {
      try {
        // @ts-expect-error wait a minuute dude
        const { routerHandler } = await vite?.ssrLoadModule('/src/app/handler.tsx')
        return await routerHandler(request, reply)
        // const { appHtml } = await routerHandler(request.url)
        // console.log('APPHTML-------------------------------------')
        // console.log(appHtml)
        // console.log('--------------------------------------------')

        // reply.status(200)
        // reply.type('text/html')
        // reply.send(appHtml)
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
