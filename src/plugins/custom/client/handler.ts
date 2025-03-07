import { createReadableStreamFromReadable } from '@react-router/node'

import { createRequestHandler } from 'react-router'

import type { CreateReactRouterHandlerParams, HttpServer, RequestHandler } from './types'

import { createRequest, sendResponse } from './utils'

export const createReactRouterHandler = <Server extends HttpServer>({
  build,
  mode,
  getLoadContext
}: CreateReactRouterHandlerParams<Server>): RequestHandler<Server> => {
  const handleRequest = createRequestHandler(build, mode)

  const handler: RequestHandler<Server> = async (request, reply) => {
    const remixRequuest = createRequest(request, reply, createReadableStreamFromReadable)
    const loadContext = await getLoadContext?.(request, reply)
    const response = await handleRequest(remixRequuest, loadContext)

    return sendResponse(reply, response)
  }
  return handler
}
