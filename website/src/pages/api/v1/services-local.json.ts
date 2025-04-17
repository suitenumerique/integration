import services from "@/data/services-local.json"

export async function GET() {
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
