import {
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteOptions
} from 'fastify'

import { PrismaClient } from '@prisma/client'

export type Result<T, E extends Error = Error> =
  | {
      data: T
      error?: null
    }
  | {
      data?: null
      error: E
    }

export type RouteType<RouteGeneric extends RouteGenericInterface = RouteGenericInterface> =
  RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGeneric
  >

export type CreateRouteObjectFunctionType<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface
> = (fastify: FastifyInstance) => RouteType<RouteGeneric>

export type ServerContextType = {
  prisma: PrismaClient
}
