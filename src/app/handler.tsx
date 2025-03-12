import { FastifyReply, FastifyRequest } from 'fastify'

import ReactDOM from 'react-dom/server'

import { createMemoryHistory } from '@tanstack/react-router'
import { StartServer } from '@tanstack/react-start-server'

import { createRouter } from '#/app/router'

export const routerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.type('text/html')
  try {
    const router = createRouter()
    const history = createMemoryHistory({
      initialEntries: [request.url]
    })
    router.update({
      history
    })
    await router.load()
    // @ts-expect-error What the hell is the issue with the router typing
    const pipeablestream = ReactDOM.renderToPipeableStream(<StartServer router={router} />)
    return reply.send(pipeablestream)
  } catch (error) {
    console.log('ERROR----------------------')
    console.log(error)
    console.log('---------------------------')
    const appHtml = `<!DOCTYPE html><html><head><title>Something went wrong</title></head><body><div>${error}</div></body></html>`
    return reply.send(appHtml)
  }
}
