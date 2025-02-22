import { createServer } from 'vite'

export async function createViteMiddleWare() {
  const vite = await createServer({
    server: {
      middlewareMode: true
    },
    appType: 'custom'
  })

  return vite
}
