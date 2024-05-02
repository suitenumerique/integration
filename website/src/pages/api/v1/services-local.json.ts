import type { APIContext } from "astro"
import services from "@/data/services-local.json"

export async function GET({ url }: APIContext) {
  const response = new Response(
    JSON.stringify(
      services
        .filter(({ enabled }) => !!enabled)
        .map((service) => ({
          id: service.id,
          name: service.name,
          url: new URL(`/services/${service.id}`, url).toString(),
        })),
    ),
  )
  response.headers.set("Content-Type", "application/json")
  return response
}
