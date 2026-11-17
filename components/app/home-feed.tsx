"use client"

import Link from "next/link"

import { FeedAd } from "@/components/ads"
import { EventGrid, EventRow, FeaturedCard } from "@/components/app/event-cards"
import { SectionHeader, text } from "@/components/app/ui"
import type { GriddEvent } from "@/lib/convex"
import { cn } from "@/lib/utils"

const FOR_YOU_SIZE = 5

/**
 * El destacado, "Para vos" y "Vas a ir" de Inicio. "Para vos" ordena primero las categorías que le
 * interesan. En la web no se filtra por distancia ("Cerca tuyo" de la app): pediría el permiso de
 * ubicación de entrada, así que se muestran todos.
 */
export function HomeFeed({
  events,
  going,
  now,
  interests,
}: {
  events: GriddEvent[]
  going: GriddEvent[]
  now: number
  interests: string[]
}) {
  const [featured, ...rest] = events
  const liked = (e: GriddEvent) => (interests.includes(e.kind) ? 0 : 1)
  const forYou = [...rest]
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
          <EventGrid events={forYou} now={now} slot={<FeedAd variant="wide" />} />
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
