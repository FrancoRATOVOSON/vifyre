import type * as http from 'node:http'
import type * as http2 from 'node:http2'
import type * as https from 'node:https'

export type HttpServer = http2.Http2SecureServer | http2.Http2Server | http.Server | https.Server

export type ServerEntryRouteHandler = (request: Request, head: string) => Promise<Response>
