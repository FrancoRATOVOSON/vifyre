import { defineConfig } from './src/config/vifyre-config.ts'

export default defineConfig({
  // Server configuration
  serverDir: './src',

  // Client build configuration (React Router output)
  client: {
    buildDir: './client',
    assetsDir: './client/assets',
    ssrBuildFile: './server/index.js'
  },

  // Server build configuration (Fastify output)
  server: {
    buildDir: '.',
    entry: './src/index.ts'
  }
})
