# ViFyRe Build System Roadmap

## Overview

This document outlines a gradual migration strategy to unify ViFyRe's build system by extending Vite to handle both client and server builds. The approach prioritizes incremental improvements, maintaining stability while working toward a cleaner, more maintainable architecture.

## Current State

### Problems

1. **Hardcoded paths**: `clientPath = '../../'` in `client-loader.ts` is brittle and environment-dependent
2. **Complex import resolution**: Custom regex-based `fixImports()` function reimplements bundler functionality
3. **Split build system**: Separate React Router (Vite) and custom SWC script with no shared configuration
4. **Framework coupling**: Build logic is tightly coupled to example app structure

### Current Build Flow

```
npm run build
├── build:client (react-router build) → dist/client + dist/server (SSR bundle)
└── build:server (node scripts/build.js) → dist/* (Fastify server)
```

---

## Phase 1: Configuration Foundation & Quick Wins

**Goal**: Centralize configuration and eliminate hardcoded paths while improving current build script.

**Timeline**: 1-2 days

### Tasks

#### 1.1 Create `vifyre.config.ts`

Create a central configuration file that both build script and runtime code can import.

```typescript
// vifyre.config.ts
import { defineConfig } from './src/config/vifyre-config'

export default defineConfig({
  // Directory structure
  serverDir: './src',                // Fastify server root
  
  // Build outputs (relative to buildDir from react-router.config.ts)
  client: {
    buildDir: './client',            // React Router output: dist/client
    assetsDir: './client/assets',    // Static assets
    ssrBuildFile: './server/index.js' // SSR server bundle
  },
  
  server: {
    buildDir: '.',                   // Server output: dist/*
    entry: './src/index.ts'          // Server entry point
  }
})
```

**Note**:

- `appDir` and `buildDir` are read directly from `react-router.config.ts`
- Path aliases are automatically read from `tsconfig.json` (already handled by SWC via `tsconfig-to-swcconfig`)
- Development settings like `port` come from environment variables, HMR is enabled by default in dev mode

**Files to create**:

- `vifyre.config.ts` - User-facing config file
- `src/config/vifyre-config.ts` - Config schema and `defineConfig` helper
- `src/config/load-config.ts` - Config loader utility

#### 1.2 Update `scripts/build.js`

Refactor build script to use centralized configuration.

**Changes**:

- Import and use `vifyre.config.ts` for all paths
- Remove hardcoded `SERVER_DIR` and `DIST_DIR`
- Simplify `fixImports()` to only handle `.js` extension addition
- Let SWC handle path aliases via `tsconfig-to-swcconfig`

**Key improvements**:

```javascript
// Before
const SERVER_DIR = path.resolve(cwd(), 'src')
const DIST_DIR = path.resolve(cwd(), 'dist')

// After
import vifyreConfig from '../vifyre.config.ts'
const SERVER_DIR = path.resolve(cwd(), vifyreConfig.serverDir)
const DIST_DIR = path.resolve(cwd(), vifyreConfig.buildDir, vifyreConfig.server.buildDir)
```

#### 1.3 Update `client-loader.ts`

Make client path dynamic using config.

**Changes**:

- Remove hardcoded `clientPath = '../../'`
- Import config and calculate path dynamically
- Use config values for static file serving paths

```typescript
// Before
const clientPath = '../../'

// After
import vifyreConfig from '#/config/vifyre-config'
const clientPath = path.relative(
  path.dirname(fileURLToPath(import.meta.url)),
  path.resolve(vifyreConfig.buildDir)
)
```

#### 1.4 Simplify Import Resolution

Refine the `fixImports()` function to focus on essential transformations.

**Current behavior**:

- SWC already handles path aliases from `tsconfig.json` via `tsconfig-to-swcconfig`
- The main job of `build.js` is adding `.js` extensions to relative imports for ESM compliance

**Strategy**:

- Keep the core functionality: add `.js` extensions to relative imports
- Simplify logic: reduce complex regex patterns and error handling
- Consider using `es-module-lexer` for cleaner parsing (optional optimization)
- Remove special casing for `app` directory (already excluded from server build)

**Key point**: Path alias resolution is already working correctly through SWC configuration.

### Phase 1 Deliverables

- [ ] `vifyre.config.ts` with full type safety
- [ ] Updated `build.js` using config
- [ ] Updated `client-loader.ts` using config
- [ ] Simplified import resolution
- [ ] Documentation in README for config options

### Success Metrics

- No hardcoded paths in codebase
- `npm run build` works with new config
- `npm run dev` works with new config
- Can change output directories via config without code changes

---

## Phase 2: Vite Plugin Integration

**Goal**: Replace custom build script with a Vite plugin that handles server builds.

**Timeline**: 3-5 days

### Background

React Router already uses Vite for client builds. We'll extend this by creating a custom Vite plugin that:

1. Builds the Fastify server code after React Router finishes
2. Uses Vite's built-in import resolution (no more custom `fixImports`)
3. Outputs unbundled server files (preserving directory structure)
4. Shares configuration with client build

### Phase 2 Tasks

#### 2.1 Research & Design

Investigate Vite plugin architecture and implementation approach.

**Decisions made**:

- **Server output**: Unbundled (preserves directory structure, matches dev behavior, easier debugging)
- **Plugin approach**: Custom solution inspired by `vite-plugin-node` but tailored for ViFyRe
  - Note: `vite-plugin-node` development appears inactive, and we want full control
- **Build order**: Server build runs after React Router completes (using Vite's `closeBundle` hook)

**Research tasks**:

- [ ] Study Vite plugin API (especially `writeBundle` and `closeBundle` hooks)
- [ ] Review `vite-plugin-node` source for inspiration (but don't use directly)
- [ ] Prototype simple plugin that logs build info and file structure

#### 2.2 Create `vifyre-server-plugin`

Build custom Vite plugin for server compilation.

**Plugin structure**:

```typescript
// plugins/vifyre-server/index.ts
import type { Plugin } from 'vite'
import type { ViFyReConfig } from '../../config/vifyre-config'

export function vifyreServer(config: ViFyReConfig): Plugin {
  return {
    name: 'vifyre:server',
    apply: 'build', // Only in build mode, not dev
    
    async closeBundle() {
      // Build server after React Router finishes
      // 1. Find all .ts files in serverDir (excluding appDir)
      // 2. Use Vite's module resolution for imports
      // 3. Transform with SWC or esbuild
      // 4. Output to server.buildDir
    }
  }
}
```

**Features**:

- Read from `vifyre.config.ts`
- Exclude `appDir` from server build (React Router handles it)
- Use Vite's `resolveId` and `load` hooks for path resolution
- Emit files to correct output directory
- Handle TypeScript path aliases automatically

#### 2.3 Update `vite.config.ts`

Integrate new plugin with existing React Router setup.

```typescript
// vite.config.ts
import { reactRouter } from '@react-router/dev/vite'
import { vifyreServer } from './plugins/vifyre-server'
import vifyreConfig from './vifyre.config'

export default defineConfig({
  plugins: [
    reactRouter(),
    vifyreServer(vifyreConfig)
  ]
})
```

#### 2.4 Update Build Scripts

Simplify package.json scripts.

```json
{
  "scripts": {
    "build": "vite build",
    "build:client": "vite build --mode client",
    "build:server": "vite build --mode server"
  }
}
```

#### 2.5 Development Mode Integration

Ensure plugin handles development mode correctly.

**Strategy**:

- Keep current `@swc-node/register` + nodemon approach for dev mode
  - This will eventually be replaced by Node.js native `--experimental-strip-types` (when stable)
- HMR is essential for developer experience and must always be enabled
- The Vite plugin focuses on production builds (`apply: 'build'`)
- Development workflow remains unchanged (handled by nodemon + Vite dev server)

### Phase 2 Deliverables

- [ ] `plugins/vifyre-server/` directory with plugin code
- [ ] Updated `vite.config.ts` using plugin
- [ ] Removed `scripts/build.js`
- [ ] Single `vite build` command replaces both `react-router build` and custom build script
- [ ] Tests for plugin (build validation)
- [ ] Verify output structure matches current system

### Phase 2 Success Metrics

- `vite build` produces identical output to old `react-router build` + `node scripts/build.js`
- Build time is comparable or faster
- No more custom import resolution code
- All TypeScript path aliases work automatically

---

## Phase 3: CLI & Developer Experience

**Goal**: Create a ViFyRe CLI tool for better DX and framework polish.

**Timeline**: 5-7 days

### Tasks

#### 3.1 Create CLI Package

Build a command-line interface for ViFyRe.

**Structure**:

```
packages/cli/
├── src/
│   ├── index.ts
│   ├── commands/
│   │   ├── build.ts
│   │   ├── dev.ts
│   │   ├── start.ts
│   │   └── create.ts
│   └── utils/
├── package.json
└── README.md
```

**Commands**:

```bash
vifyre dev      # Start development server
vifyre build    # Build for production
vifyre start    # Run production server
vifyre create   # Scaffold new project
```

#### 3.2 Enhanced Development Mode

Improve dev server with better HMR and error handling.

**Features**:

- Unified dev server (Fastify + Vite in one process)
- Server-side HMR (restart Fastify on changes)
- Better error overlays
- Development dashboard (optional)

**Integration**:

```typescript
// Fastify server detects dev mode and uses Vite middleware
if (env.NODE_ENV === 'development') {
  const vite = await createViteDevServer()
  await server.register(vitePlugin(vite))
}
```

#### 3.3 Configuration Validation

Add runtime validation for `vifyre.config.ts`.

**Features**:

- Zod schema for config validation
- Helpful error messages for invalid config
- Type inference for TypeScript users
- Config file discovery (find vifyre.config.{ts,js,mjs})

#### 3.4 Project Scaffolding

Create `vifyre create` command for new projects.

**Templates**:

- **Basic**: Minimal ViFyRe setup (Fastify + React Router + Vite)
- **Full-stack**: Complete setup with `better-auth` + `drizzle` (default recommendation)
- **API-focused** (optional): Scaffolds a complete Fastify API with auth, database, and security best practices
  - Note: This is essentially a structured Fastify app; evaluate if it adds value to ViFyRe's mission

**Implementation**:

```bash
vifyre create my-app
# Prompts: template, package manager, git init?
```

#### 3.5 Build Optimizations

Add production build enhancements.

**Features**:

- Code splitting strategies
- Environment variable injection
- Asset optimization
- Build cache
- Parallel builds (client + server simultaneously)

### Deliverables

- [ ] `packages/cli` package
- [ ] `vifyre` command available globally
- [ ] Project templates
- [ ] Improved dev mode with HMR
- [ ] Configuration validation
- [ ] CLI documentation

### Success Metrics

- New projects can be created in < 30 seconds
- Dev server starts in < 3 seconds
- Build time reduced by 20%+
- Clear error messages for common issues

---

## Phase 4: Framework Maturity & Ecosystem

**Goal**: Polish ViFyRe into a production-ready framework with community features.

**Timeline**: Ongoing

### Tasks

#### 4.1 Plugin System

Create a plugin API for extensibility.

**Features**:

- Hook into build process
- Add custom Fastify plugins
- Extend Vite configuration
- Custom React Router routes

**Example**:

```typescript
// vifyre.config.ts
export default defineConfig({
  plugins: [
    vifyreAuth(), // Adds auth routes and middleware
    vifyreDB({ orm: 'prisma' }), // Database integration
  ]
})
```

#### 4.2 Documentation Site

Build comprehensive docs.

**Sections**:

- Getting Started
- Configuration Reference
- API Routes
- SSR Guide
- Deployment
- Migration from Next.js/Remix

#### 4.3 Testing Utilities

Provide testing helpers.

**Features**:

- Test utilities for API routes
- SSR testing helpers
- Mock utilities
- Example test setups

#### 4.4 Deployment Presets

Add deployment targets.

**Presets**:

- Docker (current)
- Vercel/Netlify (serverless)
- AWS/GCP
- Self-hosted VPS

#### 4.5 Performance Monitoring

Add observability features.

**Features**:

- Built-in performance metrics
- Request tracing
- Error reporting hooks
- Development profiling

### Deliverables

- [ ] Plugin API documentation
- [ ] Official docs site
- [ ] Testing utilities package
- [ ] Deployment guides
- [ ] Performance monitoring integration

---

## Technical Decisions Log

### Why extend Vite instead of replacing it?

- React Router already uses Vite (don't fight the ecosystem)
- Vite has excellent import resolution and plugin system
- Single build tool reduces complexity
- Better HMR and dev experience

### Why keep server code unbundled?

- Better debugging (stack traces point to source structure)
- Faster incremental builds
- More similar to development environment
- Easier to inspect output

### Why custom plugin instead of existing tools?

- Full control over build process
- Can optimize for Fastify + React Router specifically
- Lighter weight than full-featured alternatives
- Educational value for framework understanding

### Why gradual migration?

- Reduces risk of breaking changes
- Allows for course correction
- Maintains working system at each step
- Easier to get community feedback

---

## Migration Checklist

### Pre-Phase 1

- [ ] Review current build system thoroughly
- [ ] Document all edge cases and special requirements
- [ ] Set up testing for build outputs
- [ ] Create git branch for migration work

### Phase 1 Exit Criteria

- [ ] All builds pass with new config
- [ ] No hardcoded paths remain
- [ ] Tests pass
- [ ] Documentation updated

### Phase 2 Exit Criteria

- [ ] Vite plugin builds identical output
- [ ] Performance is equal or better
- [ ] Can remove `scripts/build.js`
- [ ] CI/CD works with new system

### Phase 3 Exit Criteria

- [ ] CLI is published and working
- [ ] Can create new projects with CLI
- [ ] Dev mode HMR works smoothly
- [ ] Documentation is complete

### Phase 4 Exit Criteria

- [ ] Plugin system is stable
- [ ] At least 3 community plugins exist
- [ ] Production deployments are successful
- [ ] Framework is 1.0 ready
