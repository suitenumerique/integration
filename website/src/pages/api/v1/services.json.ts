import type { APIContext } from "astro"
import services from "@/data/services.json"

export async function GET({ url }: APIContext) {
  const response = new Response(
    JSON.stringify(
      services.map((service) => ({
        id: service.id,
        name: service.name,
        url: new URL(`/services/${service.id}`, url).toString(),
      })),
    ),
  )
  response.headers.set("Content-Type", "application/json")
  return response
}
