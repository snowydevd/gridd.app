import type { Metadata } from "next"

import { TopBanner } from "@/components/ads"
import { EventsMap } from "@/components/app/events-map"
import { listMapEvents } from "@/lib/convex"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Mapa",
  description: "Los encuentros fierreros que se vienen en Uruguay, en el mapa.",
  path: "/mapa",
})

// Un evento puede publicarse o cancelarse en cualquier momento: se pide en cada visita.
export const dynamic = "force-dynamic"

/** La pestaña Mapa. La key de Google Maps es de navegador, restringida a gridd.app. */
export default async function MapaPage() {
  const { events, now } = await listMapEvents()
  return (
    <main className="flex h-[calc(100dvh-4rem-env(safe-area-inset-bottom))] flex-col">
      <h1 className="sr-only">Mapa de encuentros</h1>
      <TopBanner />
      <EventsMap events={events} now={now} mapsKey={process.env.GOOGLE_MAPS_API_KEY} />
    </main>
  )
}
