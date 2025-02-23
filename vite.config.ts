import { join } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
  root: join(import.meta.dirname, 'client'),
  plugins: [tailwindcss(), TanStackRouterVite(), viteReact(), tsconfigPaths()],
  build: {
    outDir: join(import.meta.dirname, 'dist/client')
  }
}))
