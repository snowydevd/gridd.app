import type { Metadata } from "next"

import { EventsList } from "@/components/app/events-list"
import { ScreenHeader } from "@/components/app/ui"
import { getViewer, listUpcomingEvents } from "@/lib/convex"
import { DEFAULT_SEARCH_RADIUS } from "@/lib/search-radius"
import { pageMetadata } from "@/lib/seo"
import { pageToken } from "@/lib/session"

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
  const token = await pageToken("/eventos")
  const [{ events, now }, viewer] = await Promise.all([listUpcomingEvents(), getViewer(token)])
  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Próximos encuentros" fallback="/" />
      <EventsList events={events} now={now} radius={viewer?.searchRadius ?? DEFAULT_SEARCH_RADIUS} />
    </div>
  )
}
