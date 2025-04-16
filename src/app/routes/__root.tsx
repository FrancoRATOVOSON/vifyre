import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { QueryProvider } from '../providers/query'
import { RouterContext } from '../routerContext'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        title: 'TanStack Router SSR Basic File Based'
      },
      {
        charSet: 'UTF-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }
    ],
    scripts: [
      {
        type: 'module',
        children: `import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true`
      },
      {
        type: 'module',
        src: '/@vite/client'
      },
      {
        type: 'module',
        src: '/src/app/entry-client.tsx'
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/src/app/root.css'
      }
    ]
  }),
  component: RootComponent
})

function RootComponent() {
  return (
    <QueryProvider>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <Outlet />
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </body>
      </html>
    </QueryProvider>
  )
}
