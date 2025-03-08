import type * as http from 'node:http'
import type * as http2 from 'node:http2'
import type * as https from 'node:https'

import { type FastifyReply, type FastifyRequest, type RouteGenericInterface } from 'fastify'

import { type AppLoadContext, type ServerBuild } from 'react-router'

export type HttpServer = http2.Http2SecureServer | http2.Http2Server | http.Server | https.Server

type GenericGetLoadContextFunction<Server extends HttpServer, AppLoadContext> = (
  request: FastifyRequest<RouteGenericInterface, Server>,
  reply: FastifyReply<RouteGenericInterface, Server>
) => AppLoadContext | Promise<AppLoadContext>

type GetLoadContextFunction<Server extends HttpServer = HttpServer> = GenericGetLoadContextFunction<
  Server,
  AppLoadContext
>

export type CreateReactRouterHandlerParams<Server extends HttpServer> = {
  build: (() => Promise<ServerBuild> | ServerBuild) | ServerBuild
  getLoadContext?: GetLoadContextFunction<Server>
  mode?: string
}

export type RequestHandler<Server extends HttpServer> = (
  request: FastifyRequest<RouteGenericInterface, Server>,
  reply: FastifyReply<RouteGenericInterface, Server>
) => Promise<void>
