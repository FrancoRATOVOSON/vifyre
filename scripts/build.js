// @ts-check
import { promises as fs } from 'node:fs'
import { isBuiltin } from 'node:module'
import path from 'node:path'
import { cwd } from 'node:process'
import { URL } from 'node:url'

import { transformFile } from '@swc/core'
import { moduleResolve, resolve } from 'import-meta-resolve'
import { convert } from 'tsconfig-to-swcconfig'

// 1️⃣ Load SWC options from tsconfig
const swcOptions = convert('tsconfig.node.json', cwd(), {
  jsc: {
    transform: undefined
  }
})

const SERVER_DIR = path.resolve(cwd(), 'server')
const DIST_DIR = path.resolve(cwd(), 'dist')

// Ensure dist folder exists
await fs.mkdir(DIST_DIR, { recursive: true })

// 2️⃣ Find all `.ts` files recursively in `server/`
async function getTSFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(entry => {
      const fullPath = path.join(dir, entry.name)
      return entry.isDirectory() ? getTSFiles(fullPath) : fullPath.endsWith('.ts') ? fullPath : null
    })
  )
  return files.flat().filter(Boolean)
}

// 3️⃣ Resolve Imports & Add `.js` Extension
async function fixImports(sourceCode, filePath) {
  return sourceCode.replace(
    /import\s+(.+?)\s+from\s+["'](.+?)["'];?/g,
    (match, importClause, importPath) => {
      if (isBuiltin(importPath)) return match // ✅ Keep as-is for built-ins
      try {
        const resolved = moduleResolve(importPath, new URL(`file://${filePath}`)).toString()

        if (resolved.includes('node_modules')) {
          return match // ✅ Keep as-is dependencies
        }

        if (importPath.startsWith('.')) {
          console.log(`🔍 Resolved import "${importPath}" in ${filePath} to "${resolved}"`)
          const resolvedPath = resolved.endsWith('index.js') ? `${importPath}/index` : importPath // ✅ Add /index.js if needed
          return `import ${importClause} from "${resolvedPath}.js";` // ✅ Add .js
        }

        return match // ✅ Keep other imports unchanged
      } catch (err) {
        const resolved = resolve(importPath, `file://${filePath}`)
        if (resolved.includes('node_modules')) return match // ✅ Keep as-is dependencies

        switch (err.code) {
          case 'ERR_UNSUPPORTED_DIR_IMPORT':
            return `import ${importClause} from "${importPath}/index.js";` // ✅ Add index.js
          case 'ERR_MODULE_NOT_FOUND':
            return `import ${importClause} from "${importPath}.js";` // ✅ Add .js
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
}

await compileAll()
