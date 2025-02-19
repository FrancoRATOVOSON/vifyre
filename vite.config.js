import { viteFastify } from '@fastify/vite/plugin'
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { join } from 'node:path';
import viteReact from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  // build: {
  //   rollupOptions: isSsrBuild
  //     ? {
  //         input: "./server/app.ts",
  //       }
  //     : undefined,
  // },
  root: join(import.meta.dirname, 'client'),
  plugins: [tailwindcss(), viteFastify(), viteReact({ jsxRuntime: "classic" }), tsconfigPaths()],
}));