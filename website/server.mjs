import { join } from "path"
import Fastify from "fastify"
import fsfStatic from "@fastify/static"
import fsfCompress from "@fastify/compress"
const fastify = Fastify({
  logger: true,
})

fastify.register(fsfCompress)

fastify.register(fsfStatic, {
  root: join(import.meta.dirname, process.env.STATIC_DIR || "dist"),
})

try {
  fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
