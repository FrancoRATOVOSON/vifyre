import { createApp } from './app'
import env from './config/env'

async function main() {
  const port = env.PORT
  const app = await createApp()

  try {
    await app.ready()
    await app.listen({ port })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

await main()
