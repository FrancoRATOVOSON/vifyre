import { PrismaClient } from '@prisma/client'
import { createRequestHandler, defaultStreamHandler } from '@tanstack/react-start-server'

import type { ServerEntryRouteHandler } from '#/router/client/types'

import { createRouter } from '#/app/router'

export const routerHandler: ServerEntryRouteHandler = async (
  request: Request,
  prisma: PrismaClient,
  head: string
) => {
  const handler = createRequestHandler({
    request,
    createRouter: () => {
      const router = createRouter()

      router.update({
        context: {
          ...router.options.context,
          head,
          prisma
        }
      })

      return router
    }
  })

  const response = await handler(defaultStreamHandler)
  return response
}
