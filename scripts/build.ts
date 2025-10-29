// @ts-check
import { promises as fs } from 'node:fs'
import { isBuiltin } from 'node:module'
import path from 'node:path'
import { cwd } from 'node:process'
import { URL } from 'node:url'

import { transformFile } from '@swc/core'
import { moduleResolve, resolve } from 'import-meta-resolve'
import { convert } from 'tsconfig-to-swcconfig'

import { loadViFyReConfig } from '../src/config/load-config.ts'

// Load ViFyRe configuration
const config = await loadViFyReConfig()

// 1️⃣ Load SWC options from tsconfig
const swcOptions = convert('tsconfig.node.json', cwd(), {
  jsc: {
    transform: undefined,
    baseUrl: cwd()
  }
})

const SERVER_DIR = config.serverDir
const DIST_DIR = path.join(config.buildDir, config.server.buildDir)

// Ensure dist folder exists
await fs.mkdir(DIST_DIR, { recursive: true })

// 2️⃣ Find all `.ts` files recursively in `src/`
async function getTSFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry): Promise<string | string[] | null> => {
      const fullPath = path.join(dir, entry.name)

      // Ignore the React Router app directory (from config)
      // Only ignore if it's the exact directory, not files that start with 'app'
      if (fullPath === config.appDir || fullPath.startsWith(config.appDir + path.sep)) {
        return null
      }

      return entry.isDirectory() ? getTSFiles(fullPath) : fullPath.endsWith('.ts') ? fullPath : null
    })
  )
  return files.flat().filter(Boolean) as string[]
}

// 3️⃣ Resolve Imports & Add `.js` Extension
async function fixImports(sourceCode: string, filePath: string): Promise<string> {
  return sourceCode
    .replace(
      /import\s+(.+?)\s+from\s+["'](.+?)["'];?/g,
      (match: string, importClause: string, importPath: string) => {
        if (isBuiltin(importPath)) return match // ✅ Keep as-is for built-ins
        try {
          const resolved = moduleResolve(importPath, new URL(`file://${filePath}`)).toString()

          if (resolved.includes('node_modules')) {
            return match // ✅ Keep as-is dependencies
          }

          return match // ✅ Keep other imports unchanged
        } catch (err) {
          const resolved = resolve(importPath, `file://${filePath}`)
          if (resolved.includes('node_modules')) return match // ✅ Keep as-is dependencies

          const error = err as { code?: string }
          switch (error.code) {
            case 'ERR_UNSUPPORTED_DIR_IMPORT': {
              const newImportPath = importPath.includes('app')
                ? `${importPath}.js`
                : `${importPath}/index.js`
              return `import ${importClause} from "${newImportPath}";`
            } // ✅ Add index.js
            case 'ERR_MODULE_NOT_FOUND':
              return `import ${importClause} from "${importPath}.js";` // ✅ Add .js
            default:
              return match
          }
        }
      }
    ) // ✅ Handle export statements (named & wildcard exports)
    .replace(
      /export\s+(.*?)\s+from\s+["'](.+?)["'];?/g,
      (match: string, exportClause: string, exportPath: string) => {
        if (isBuiltin(exportPath)) return match // ✅ Keep as-is for built-ins
        try {
          const resolved = moduleResolve(exportPath, new URL(`file://${filePath}`)).toString()

          if (resolved.includes('node_modules')) {
            return match // ✅ Keep as-is for built-ins or dependencies
          }

          return match // ✅ Keep other exports unchanged
        } catch (err) {
          const resolved = resolve(exportPath, `file://${filePath}`)
          if (resolved.includes('node_modules')) return match // ✅ Keep as-is dependencies

          const error = err as { code?: string }
          switch (error.code) {
            case 'ERR_UNSUPPORTED_DIR_IMPORT':
              return `export ${exportClause} from "${exportPath}/index.js";` // ✅ Add index.js
            case 'ERR_MODULE_NOT_FOUND':
              return `export ${exportClause} from "${exportPath}.js";` // ✅ Add .js
            default:
              return match
          }
        }
      }
    )
}

// 4️⃣ Process all `.ts` files
async function compileAll() {
  const tsFiles = await getTSFiles(SERVER_DIR)

  for (const tsFile of tsFiles) {
    const relativePath = path.relative(SERVER_DIR, tsFile).replace(/\.ts$/, '.js')
    const outputFile = path.join(DIST_DIR, relativePath)

    const output = await transformFile(tsFile, swcOptions)
    const fixedCode = await fixImports(output.code, tsFile)

    await fs.mkdir(path.dirname(outputFile), { recursive: true })
    await fs.writeFile(outputFile, fixedCode, 'utf8')
  }

  console.log('✅ Compilation complete!')
  console.log(`📁 Server files: ${SERVER_DIR}`)
  console.log(`📦 Output directory: ${DIST_DIR}`)
}

await compileAll()
