import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { join } from 'node:path';
import viteReact from '@vitejs/plugin-react-swc'

export default defineConfig(() => ({
  root: join(import.meta.dirname, 'client'),
  plugins: [tailwindcss(), viteReact(), tsconfigPaths()],
}));