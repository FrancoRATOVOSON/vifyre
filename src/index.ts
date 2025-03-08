import fp from 'fastify-plugin'

import closeWithGrace from 'close-with-grace'

import { createApp } from './app'
import { createServer, env } from './config'

async function main() {
  const port = env.PORT
  const app = createServer()

  try {
    await app.register(fp(createApp))

    closeWithGrace(
      {
        delay: 500
      },
      async ({ err }) => {
        if (err != null) {
          app.log.error(err)
        }
        await app.close()
      }
    )

    await app.ready()
    await app.listen({ port })

    if (env.NODE_ENV !== 'production') console.log(app.routes)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

await main()
