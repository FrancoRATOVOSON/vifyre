// @ts-check
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'

import { transformFile } from '@swc/core'
import { resolve } from 'import-meta-resolve'
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
      try {
        const resolved = resolve(importPath, `file://${filePath}`)

        if (resolved.startsWith('node:') || resolved.includes('node_modules')) {
          return match // ✅ Keep as-is for built-ins or dependencies
        }

        if (importPath.startsWith('.')) {
          return `import ${importClause} from "${importPath}.js";` // ✅ Add .js
        }

        return match // ✅ Keep other imports unchanged
      } catch (err) {
        console.warn(`⚠️ Error resolving import "${importPath}" in ${filePath}: ${err}`)
        return match
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
