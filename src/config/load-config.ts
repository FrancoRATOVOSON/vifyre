import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { pathToFileURL } from 'node:url'

import type { ViFyReConfig, ViFyReResolvedConfig } from './vifyre-config'

/**
 * Loads React Router configuration from react-router.config.ts
 */
async function loadReactRouterConfig(
  rootDir: string
): Promise<{ appDirectory: string; buildDirectory: string }> {
  const configPath = path.resolve(rootDir, 'react-router.config.ts')

  if (!existsSync(configPath)) {
    throw new Error(
      `React Router config not found at ${configPath}. ViFyRe requires react-router.config.ts to be present.`
    )
  }

  try {
    const configUrl = pathToFileURL(configPath).href
    const config = await import(configUrl)
    const reactRouterConfig = config.default

    if (!reactRouterConfig.appDirectory || !reactRouterConfig.buildDirectory) {
      throw new Error(
        'react-router.config.ts must export appDirectory and buildDirectory. Please ensure your config is valid.'
      )
    }

    return {
      appDirectory: reactRouterConfig.appDirectory,
      buildDirectory: reactRouterConfig.buildDirectory
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('appDirectory')) {
      throw error
    }
    throw new Error(
      `Failed to load react-router.config.ts: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Loads TypeScript path aliases from tsconfig.json
 * Tries tsconfig.node.json first (for server builds), falls back to tsconfig.json
 */
function loadTsConfigPaths(rootDir: string): Record<string, string[]> {
  const tsconfigNodePath = path.resolve(rootDir, 'tsconfig.node.json')
  const tsconfigPath = path.resolve(rootDir, 'tsconfig.json')

  let configPath: string
  if (existsSync(tsconfigNodePath)) {
    configPath = tsconfigNodePath
  } else if (existsSync(tsconfigPath)) {
    configPath = tsconfigPath
  } else {
    console.warn('No tsconfig.json found. Path aliases will not be loaded.')
    return {}
  }

  try {
    const tsconfigContent = readFileSync(configPath, 'utf-8')
    // Remove comments from JSON (tsconfig allows comments)
    const jsonContent = tsconfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    const tsconfig = JSON.parse(jsonContent)

    return tsconfig.compilerOptions?.paths || {}
  } catch (error) {
    console.warn(
      `Failed to parse ${path.basename(configPath)}: ${error instanceof Error ? error.message : String(error)}`
    )
    return {}
  }
}

/**
 * Loads ViFyRe user configuration from vifyre.config.ts
 */
async function loadUserConfig(rootDir: string): Promise<ViFyReConfig> {
  const configPath = path.resolve(rootDir, 'vifyre.config.ts')

  if (!existsSync(configPath)) {
    throw new Error(
      `ViFyRe config not found at ${configPath}. Please create a vifyre.config.ts file in your project root.`
    )
  }

  try {
    const configUrl = pathToFileURL(configPath).href
    const config = await import(configUrl)
    const vifyreConfig = config.default

    if (!vifyreConfig) {
      throw new Error(
        'vifyre.config.ts must have a default export. Use defineConfig() to create your configuration.'
      )
    }

    return vifyreConfig
  } catch (error) {
    if (error instanceof Error && error.message.includes('default export')) {
      throw error
    }
    throw new Error(
      `Failed to load vifyre.config.ts: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Loads and resolves the complete ViFyRe configuration
 * Combines user config with auto-loaded values from react-router.config.ts and tsconfig.json
 *
 * @param rootDir - Project root directory (defaults to process.cwd())
 * @returns Resolved configuration with all paths and settings
 *
 * @example
 * ```typescript
 * const config = await loadViFyReConfig()
 * console.log(config.buildDir) // '/absolute/path/to/dist'
 * console.log(config.serverDir) // '/absolute/path/to/src'
 * ```
 */
export async function loadViFyReConfig(rootDir: string = cwd()): Promise<ViFyReResolvedConfig> {
  // Load user configuration
  const userConfig = await loadUserConfig(rootDir)

  // Auto-load React Router configuration
  const reactRouterConfig = await loadReactRouterConfig(rootDir)

  // Auto-load TypeScript path aliases
  const alias = loadTsConfigPaths(rootDir)

  // Merge and resolve all paths to absolute
  const resolvedConfig: ViFyReResolvedConfig = {
    ...userConfig,
    appDir: path.resolve(rootDir, reactRouterConfig.appDirectory),
    buildDir: path.resolve(rootDir, reactRouterConfig.buildDirectory),
    serverDir: path.resolve(rootDir, userConfig.serverDir),
    alias,
    client: {
      buildDir: userConfig.client.buildDir,
      assetsDir: userConfig.client.assetsDir,
      ssrBuildFile: userConfig.client.ssrBuildFile
    },
    server: {
      buildDir: userConfig.server.buildDir,
      entry: path.resolve(rootDir, userConfig.server.entry)
    }
  }

  return resolvedConfig
}

/**
 * Synchronously loads TypeScript path aliases (for build scripts)
 * Use this when async loading is not possible
 */
export function loadTsConfigPathsSync(rootDir: string = cwd()): Record<string, string[]> {
  return loadTsConfigPaths(rootDir)
}
