"use client"

import Link from "next/link"

import { EventGrid, EventRow, FeaturedCard } from "@/components/app/event-cards"
import { SectionHeader, text } from "@/components/app/ui"
import type { GriddEvent } from "@/lib/convex"
import { distanceKm, withinRadius, type SearchRadius } from "@/lib/search-radius"
import { useKnownLocation } from "@/lib/use-location"
import { cn } from "@/lib/utils"

const FOR_YOU_SIZE = 5

/**
 * El destacado, "Para vos" y "Vas a ir" de Inicio. "Para vos" filtra por el rango de "Cerca tuyo"
 * cuando se conoce la ubicación y ordena primero las categorías que le interesan (como la app).
 */
export function HomeFeed({
  events,
  going,
  now,
  interests,
  radius,
}: {
  events: GriddEvent[]
  going: GriddEvent[]
  now: number
  interests: string[]
  radius: SearchRadius
}) {
  const here = useKnownLocation()
  const [featured, ...rest] = events
  const liked = (e: GriddEvent) => (interests.includes(e.kind) ? 0 : 1)
  const forYou = rest
    .filter((e) => !here || withinRadius(distanceKm(here, { lat: e.lat, lon: e.lon }), radius))
    .sort((a, b) => liked(a) - liked(b) || a.startsAt - b.startsAt)
    .slice(0, FOR_YOU_SIZE)

  return (
    <>
      {featured && <FeaturedCard event={featured} now={now} />}

      {forYou.length > 0 && (
        <section className="mt-8">
          <SectionHeader
            title="Para vos"
            action={
              <Link href="/eventos" className={cn(text.label, "text-muted-foreground hover:text-foreground")}>
                Ver todo
              </Link>
            }
          />
          <EventGrid events={forYou} now={now} />
        </section>
      )}

      {going.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Vas a ir" />
          {going.map((e) => (
            // Un cancelado queda atenuado: sigue en la lista para que se entere.
            <EventRow key={e._id} event={e} now={now} dimmed={e.status === "cancelled"} />
          ))}
        </section>
      )}
    </>
  )
}
