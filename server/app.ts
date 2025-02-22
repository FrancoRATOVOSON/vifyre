import { createServer } from './config/server'

export function createApp() {
  const server = createServer()

  return server
}
