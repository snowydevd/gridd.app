"use client"

import { EventRow } from "@/components/app/event-cards"
import { FlyerCarousel } from "@/components/app/flyers"
import { SectionHeader } from "@/components/app/ui"
import type { GriddEvent } from "@/lib/convex"
import { whenLabel } from "@/lib/event-format"

const FOR_YOU_SIZE = 5

/**
 * El carrusel "Para vos" (el destacado primero, con "Hoy" o "Próximo") y "Vas a ir" de Inicio. "Para vos" ordena primero las categorías que le
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
      {featured && (
        <section>
          <SectionHeader title="Para vos" />
          <FlyerCarousel
            events={[featured, ...forYou]}
            now={now}
            badge={(e, i) => (i === 0 ? { label: whenLabel(e, now).isToday ? "Hoy" : "Próximo", accent: true } : undefined)}
          />
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
