import fastifyVite from "@fastify/vite";
import fastify from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";

async function main(dev?:boolean) {
  const server = fastify()

  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)

  await server.register(fastifyVite, {
    root: path.resolve(dirname,'..'),
    dev: dev || process.argv.includes('--dev'),
    // @ts-ignore
    async createRenderFunction({createApp}) {
      return () => {
        return {
           // @ts-ignore
          element: renderToString(createApp())
        }
      }
    },
  })

  server.get('/', (req,reply) => {
    return reply.html()
  })

  await server.vite.ready()

  return server
}

if(process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await main(process.env.ENV === "dev")
  await server.listen({port: 8080})
}