import fs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import fastifyStatic from '@fastify/static'
import fastifyPlugin from 'fastify-plugin'
import { ViteDevServer } from 'vite'

import { env } from '../../../config'
import { fastifyToRequest } from '../../../utils/helpers'

const clientPath = env.NODE_ENV === 'production' ? '../../client' : '../../../client'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

type FastifyPluginClientOptionsType = {
  viteSertver?: ViteDevServer
}

export const clientPlugin = fastifyPlugin<FastifyPluginClientOptionsType>(
  async (server, { viteSertver: vite }) => {
    if (env.NODE_ENV === 'production')
      server.register(fastifyStatic, {
        root: path.resolve(__dirname, clientPath),
        wildcard: false,
        index: false,
        preCompressed: true
      })

    server.get('*', async (request, reply) => {
      const url = request.url
      try {
        const templateHtml = await fs.readFile(
          path.resolve(__dirname, clientPath, 'index.html'),
          'utf-8'
        )

        let template: string
        let render: (request: Request) => Promise<{ head: string; html: string }>
        if (env.NODE_ENV !== 'production' && vite) {
          template = await vite.transformIndexHtml(url, templateHtml)
          render = (
            await vite.ssrLoadModule(path.resolve(__dirname, clientPath, 'entry.server.tsx'))
          ).render
        } else {
          template = templateHtml
          render = (await import(path.resolve(__dirname, '../../server/entry.server.js'))).render
        }

        const req = fastifyToRequest(request)
        const appHtml = await render(req)
        const html = template
          .replace(`<!--app-head-->`, appHtml.head ?? '')
          .replace(`<!--app-html-->`, appHtml.html ?? '')

        reply.type('text/html').send(html)
      } catch (error) {
        vite?.ssrFixStacktrace(error)
        server.log.error(error)
        reply.status(500).send(error.message ? error.message : 'Internal Server Error')
      }
    })
  }
)
