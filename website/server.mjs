import { join } from "path"
import Fastify from "fastify"
import fsfStatic from "@fastify/static"
import fsfCors from "@fastify/cors"

const fastify = Fastify({
  logger: true,
})

fastify.register(fsfCors)

fastify.register(fsfStatic, {
  root: join(import.meta.dirname, process.env.STATIC_DIR || "dist"),
  preCompressed: true,
})

try {
  fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
