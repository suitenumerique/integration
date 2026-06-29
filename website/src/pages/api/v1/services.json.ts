import services from "@/data/services.json"

export async function GET() {
  const response = new Response(
    JSON.stringify(
      services
        .filter(({ enabled }) => !!enabled)
        .map((service) => ({
          id: service.id,
          name: service.name,
          ...("accessibleName" in service && { accessibleName: service.accessibleName }),
          url: service.url,
        })),
    ),
  )
  response.headers.set("Content-Type", "application/json")
  return response
}
