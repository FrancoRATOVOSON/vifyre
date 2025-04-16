import type * as http from 'node:http'
import type * as http2 from 'node:http2'
import type * as https from 'node:https'

import { PrismaClient } from '@prisma/client'

export type HttpServer = http2.Http2SecureServer | http2.Http2Server | http.Server | https.Server

export type ServerEntryRouteHandler = (
  request: Request,
  prisma: PrismaClient,
  head: string
) => Promise<Response>
