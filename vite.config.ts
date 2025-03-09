import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
  plugins: [
    tailwindcss(),
    react(),
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    tsconfigPaths()
  ]
}))
