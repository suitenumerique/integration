import { join } from "path"
import Fastify from "fastify"
import staticMiddleware from "@fastify/static"
const fastify = Fastify({
  logger: true,
})

fastify.register(staticMiddleware, {
  root: join(import.meta.dirname, process.env.STATIC_DIR || "dist"),
})

try {
  fastify.listen({ port: process.env.PORT || 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
