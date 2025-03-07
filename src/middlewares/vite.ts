import { env } from '#/config'

export async function createViteMiddleWare() {
  if (env.NODE_ENV === 'production') return

  const { createServer } = await import('vite')
  const vite = await createServer({
    server: {
      middlewareMode: true
    },
    appType: 'custom'
  })

  return vite
}
