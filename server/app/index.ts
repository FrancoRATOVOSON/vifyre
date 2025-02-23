import { createServer } from '../config'
import { createViteMiddleWare } from '../middlewares/vite'
import { clientPlugin } from './plugins/client'
import { vitePlugin } from './plugins/vite'

export async function createApp() {
  const server = createServer()

  const vite = await createViteMiddleWare()

  await server.register(import('@fastify/middie'))

  server.register(vitePlugin, { viteSertver: vite })
  server.register(clientPlugin, { viteSertver: vite })

  return server
}
