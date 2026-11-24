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
  // Alto por flex-1 (el layout de pestañas ocupa toda la pantalla menos la barra) y no con un `height`
  // fijo: AdSense le pone `height: auto !important` a los ancestros del banner y, como todo lo de
  // adentro es absoluto, el mapa quedaba en 0 px.
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <h1 className="sr-only">Mapa de encuentros</h1>
      <TopBanner />
      <EventsMap events={events} now={now} mapsKey={process.env.GOOGLE_MAPS_API_KEY} />
    </main>
  )
}
