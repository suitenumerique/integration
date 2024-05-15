import type { APIContext } from "astro"
import services from "@/data/services.json"

export async function GET({ url }: APIContext) {
  const response = new Response(
    JSON.stringify(
      services
        .filter(({ enabled }) => !!enabled)
        .map((service) => ({
          id: service.id,
          name: service.name,
          url: service.url,
        })),
    ),
  )
  response.headers.set("Content-Type", "application/json")
  return response
}
