import { Readable } from 'node:stream'

import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify'

import type { HttpServer } from './types'

const getUrl = <Server extends HttpServer>(
  request: FastifyRequest<RouteGenericInterface, Server>
): string => {
  const origin = `${request.protocol}://${request.host}`
  // Use `request.originalUrl` so Remix and React Router are aware of the full path
  const url = `${origin}${request.originalUrl}`
  return url
}

const createHeaders = (requestHeaders: FastifyRequest['headers']): Headers => {
  const headers = new Headers()

  for (const [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }

  return headers
}

export const createRequest = <Server extends HttpServer>(
  request: FastifyRequest<RouteGenericInterface, Server>,
  reply: FastifyReply<RouteGenericInterface, Server>
): Request => {
  const url = getUrl(request)

  let controller: AbortController | null = new AbortController()

  const init: RequestInit = {
    headers: createHeaders(request.headers),
    method: request.method,
    signal: controller.signal
  }

  // Abort action/loaders once we can no longer write a response if we have
  // not yet sent a response (i.e., `close` without `finish`)
  // `finish` -> done rendering the response
  // `close` -> response can no longer be written to
  reply.raw.on('finish', () => (controller = null))
  reply.raw.on('close', () => controller?.abort())

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (typeof request.body === 'string') {
      init.body = request.body
    } else {
      init.body = JSON.stringify(request.body)
    }
  }

  return new Request(url, init)
}

const responseToReadable = (response: Response): null | Readable => {
  if (!response.body) return null

  const reader = response.body.getReader()
  const readable = new Readable()
  readable._read = async () => {
    const result = await reader.read()
    if (result.done) {
      readable.push(null)
    } else {
      readable.push(Buffer.from(result.value))
    }
  }

  return readable
}

export const sendResponse = async <Server extends HttpServer>(
  reply: FastifyReply<RouteGenericInterface, Server>,
  nodeResponse: Response
): Promise<void> => {
  reply.status(nodeResponse.status)

  for (const [key, values] of nodeResponse.headers.entries()) {
    reply.headers({ [key]: values })
  }

  if (nodeResponse.body) {
    const stream = responseToReadable(nodeResponse.clone())
    return reply.send(stream)
  }

  return reply.send(await nodeResponse.text())
}
