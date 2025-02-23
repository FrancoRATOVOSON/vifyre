import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import fastifyPlugin from 'fastify-plugin'
import { ViteDevServer } from 'vite'

import { env } from '../../config'

const clientPath = env.NODE_ENV === 'production' ? '../../client' : '../../../client'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

type FastifyPluginOptionsType = {
  viteSertver: ViteDevServer
}

export const vitePlugin = fastifyPlugin<FastifyPluginOptionsType>(
  async (server, { viteSertver: vite }) => {
    server.use(vite.middlewares)

    server.get('*', async (request, reply) => {
      const url = request.url
      try {
        const templateHtml = await fs.readFile(
          path.resolve(__dirname, clientPath, 'index.html'),
          'utf-8'
        )
        const template =
          env.NODE_ENV === 'development'
            ? await vite.transformIndexHtml(url, templateHtml)
            : templateHtml
        const { render } = await vite.ssrLoadModule(
          env.NODE_ENV === 'production'
            ? path.resolve(__dirname, '../../server/index.js')
            : path.resolve(__dirname, clientPath, 'index.tsx')
        )

        const appHtml = await render(url)
        const html = template
          .replace(`<!--app-head-->`, appHtml.head ?? '')
          .replace(`<!--app-html-->`, appHtml.html ?? '')

        if (url === '/') {
          reply.type('text/html').send(html)
        } else {
          const ext = path.extname(url).toLowerCase()
          switch (ext) {
            case '.js':
              reply.type('application/javascript')
              break
            case '.css':
              reply.type('text/css')
              break
            case '.json':
              reply.type('application/json')
              break
            case '.png':
              reply.type('image/png')
              break
            case '.jpg':
            case '.jpeg':
              reply.type('image/jpeg')
              break
            case '.gif':
              reply.type('image/gif')
              break
            case '.svg':
              reply.type('image/svg+xml')
              break
            default:
              reply.type('text/plain')
          }
          const filePath = path.resolve(__dirname, clientPath, url.slice(1))
          const fileContent = await fs.readFile(filePath)
          reply.send(fileContent)
        }
        // reply.type('text/html').send(html)
      } catch (error) {
        vite.ssrFixStacktrace(error)
        server.log.error(error)
        reply.status(500).send(error.message ? error.message : 'Internal Server Error')
      }
    })
  }
)
