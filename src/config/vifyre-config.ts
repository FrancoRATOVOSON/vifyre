import { z } from 'zod'

/**
 * Client-side build configuration
 */
export interface ClientConfig {
  /** Directory where React Router builds client assets (relative to buildDir) */
  buildDir: string
  /** Directory for static assets (relative to buildDir) */
  assetsDir: string
  /** Path to SSR server bundle file (relative to buildDir) */
  ssrBuildFile: string
}

/**
 * Server-side build configuration
 */
export interface ServerConfig {
  /** Directory where server code is built (relative to buildDir) */
  buildDir: string
  /** Entry point for the server application */
  entry: string
}

/**
 * ViFyRe framework configuration
 */
export interface ViFyReConfig {
  /** Directory containing Fastify server code */
  serverDir: string
  /** Client build configuration */
  client: ClientConfig
  /** Server build configuration */
  server: ServerConfig
}

/**
 * Full configuration including auto-loaded values
 * @internal
 */
export interface ViFyReResolvedConfig extends ViFyReConfig {
  /** React Router app directory (auto-loaded from react-router.config.ts) */
  appDir: string
  /** Build output root directory (auto-loaded from react-router.config.ts) */
  buildDir: string
  /** Path aliases (auto-loaded from tsconfig.json) */
  alias: Record<string, string[]>
}

/**
 * Zod schema for runtime validation
 */
export const ViFyReConfigSchema = z.object({
  serverDir: z.string().min(1, 'serverDir must be a non-empty string'),
  client: z.object({
    buildDir: z.string().min(1, 'client.buildDir must be a non-empty string'),
    assetsDir: z.string().min(1, 'client.assetsDir must be a non-empty string'),
    ssrBuildFile: z.string().min(1, 'client.ssrBuildFile must be a non-empty string')
  }),
  server: z.object({
    buildDir: z.string().min(1, 'server.buildDir must be a non-empty string'),
    entry: z.string().min(1, 'server.entry must be a non-empty string')
  })
})

/**
 * Helper function to define ViFyRe configuration with type inference
 * Provides IDE autocomplete and type checking
 *
 * @example
 * ```typescript
 * export default defineConfig({
 *   serverDir: './src',
 *   client: {
 *     buildDir: './client',
 *     assetsDir: './client/assets',
 *     ssrBuildFile: './server/index.js'
 *   },
 *   server: {
 *     buildDir: '.',
 *     entry: './src/index.ts'
 *   }
 * })
 * ```
 */
export function defineConfig(config: ViFyReConfig): ViFyReConfig {
  // Validate config at definition time
  const result = ViFyReConfigSchema.safeParse(config)

  if (!result.success) {
    const errors = result.error.errors
      .map(err => `  - ${err.path.join('.')}: ${err.message}`)
      .join('\n')
    throw new Error(`Invalid ViFyRe configuration:\n${errors}`)
  }

  return config
}
