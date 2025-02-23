import { createServer } from '../config'
import { createViteMiddleWare } from '../middlewares/vite'
import { vitePlugin } from './plugins/vite'

export async function createApp() {
  const server = createServer()
  const vite = await createViteMiddleWare()

  await server.register(import('@fastify/middie'))

  server.register(vitePlugin, { viteSertver: vite })
  return server
}
