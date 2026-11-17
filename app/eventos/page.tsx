import type { Metadata } from "next"

import { TopBanner } from "@/components/ads"
import { EventsList } from "@/components/app/events-list"
import { ScreenHeader } from "@/components/app/ui"
import { listUpcomingEvents } from "@/lib/convex"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Próximos encuentros",
  description:
    "Todos los encuentros fierreros que se vienen en Uruguay: rodadas, expos, cars & coffee y fechas de pista.",
  path: "/eventos",
})

// Se pide en cada visita: un evento puede cancelarse o sumarse en cualquier momento.
export const dynamic = "force-dynamic"

/** Todos los próximos encuentros por fecha, con filtro por categoría ("Ver todo" de Inicio). */
export default async function EventosPage() {
  const { events, now } = await listUpcomingEvents()
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBanner />
      <ScreenHeader title="Próximos encuentros" fallback="/" />
      <EventsList events={events} now={now} />
    </div>
  )
}
