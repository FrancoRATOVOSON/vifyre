import path from 'node:path'
import { fileURLToPath } from 'node:url'

import fastifyStatic from '@fastify/static'
import fastifyPlugin from 'fastify-plugin'

import { ViteDevServer } from 'vite'

import type { ServerEntryRouteHandler } from './types'

import { createRequest, sendResponse } from './utils.js'
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

    server.get('*', async (req, reply) => {
      try {
        let viteHead: string
        let routerHandler: ServerEntryRouteHandler
        if (vite && env.NODE_ENV !== 'production') {
          viteHead = await vite.transformIndexHtml(
            req.url,
            `<html><head></head><body></body></html>`
          )
          const module = await vite.ssrLoadModule('/src/app/entry-server.tsx')
          routerHandler = module.routerHandler
        } else {
          viteHead = ''
          const module = await import('../../app/entry-server.js')
          routerHandler = module.routerHandler
        }

        const head = viteHead.substring(viteHead.indexOf('<head>') + 6, viteHead.indexOf('</head>'))

        const request = createRequest(req, reply)
        const response = await routerHandler(request, server.prisma, head)

        return sendResponse(reply, response)
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
