import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import env from './config/env'
import { createServer } from './config/server'
import { createViteMiddleWare } from './middlewares/vite'

const templatePath = env.NODE_ENV === 'production' ? './client/index.html' : '../client/index.html'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createApp() {
  const server = createServer()
  const vite = await createViteMiddleWare()

  await server.register(import('@fastify/middie'))
  server.use(vite.middlewares)

  server.log.info(__dirname)
  server.get('*', async (request, reply) => {
    const url = request.url
    try {
      const templateHtml = await fs.readFile(path.resolve(__dirname, templatePath), 'utf-8')
      const template = await vite.transformIndexHtml(url, templateHtml)
      const { render } = await vite.ssrLoadModule(path.resolve(__dirname, '../client/index.tsx'))

      const appHtml = await render(url)
      const html = template.replace(`<!--app-html-->`, () => appHtml)

      reply.type('text/html').send(html)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      server.log.error(error)
      reply.status(500).send(error.message ? error.message : 'Internal Server Error')
    }
  })

  return server
}
