"use client"

import Link from "next/link"

import { text } from "@/components/app/ui"
import type { GriddEvent } from "@/lib/convex"
import { DEFAULT_COVER, whenLabel } from "@/lib/event-format"
import { distanceKm, formatKm } from "@/lib/search-radius"
import { useKnownLocation } from "@/lib/use-location"
import { cn } from "@/lib/utils"

/**
 * Tarjetas de eventos de la app (mobile/src/components/event-card.tsx): la fila compacta y la línea
 * de cuándo; los flyers del carrusel y la grilla están en flyers.tsx. Son de cliente para mostrar la
 * distancia si ya hay permiso de ubicación. `now` viene del server, así el HTML y la hidratación dicen lo mismo ("Hoy", "Mañana").
 */

/** "Pocitos · 1,4 km", o sólo el lugar si no se sabe la distancia. */
export function usePlaceLine(event: GriddEvent) {
  const here = useKnownLocation()
  if (!here) return event.placeName
  return `${event.placeName} · ${formatKm(distanceKm(here, { lat: event.lat, lon: event.lon }))}`
}

function Cover({ event, className, eager }: { event: GriddEvent; className?: string; eager?: boolean }) {
  return (
    // Viene del storage de Convex: no pasa por el optimizador de imágenes.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={event.imageUrl ?? DEFAULT_COVER}
      alt=""
      loading={eager ? "eager" : "lazy"}
      className={cn("size-full object-cover", className)}
    />
  )
}

/** "Hoy · 21:00": el acento (punto y texto) sólo cuando es hoy. */
export function WhenLine({ event, now, className }: { event: GriddEvent; now: number; className?: string }) {
  const when = whenLabel(event, now)
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      {when.isToday && <span aria-hidden className="size-1.5 rounded-full bg-brand-text" />}
      <span className={cn(text.overline, when.isToday ? "text-brand-text" : "text-muted-foreground")}>
        {when.day} · {when.time}
      </span>
      {event.status === "cancelled" && <span className={cn(text.overline, "text-destructive")}>· Cancelado</span>}
      {event.status === "hidden" && <span className={cn(text.overline, "text-destructive")}>· Oculto por moderación</span>}
    </span>
  )
}

/** Fila compacta: miniatura, cuándo, título y lugar. `dimmed` para pasados y cancelados. */
export function EventRow({ event, now, dimmed, href }: { event: GriddEvent; now: number; dimmed?: boolean; href?: string }) {
  const place = usePlaceLine(event)
  return (
    <Link
      href={href ?? `/e/${event.slug}`}
      className={cn(
        "flex items-center gap-3 rounded-[12px] py-2 outline-none active:opacity-70 focus-visible:ring-[3px] focus-visible:ring-ring/60",
        dimmed && "opacity-50"
      )}
    >
      {/* Vertical como los flyers; acá se recorta (la miniatura no está para leerse). */}
      <span className="h-[72px] w-[54px] shrink-0 overflow-hidden rounded-[12px] bg-raised">
        <Cover event={event} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <WhenLine event={event} now={now} />
        <span className={cn(text.heading, "truncate")}>{event.title}</span>
        <span className={cn(text.caption, "truncate text-muted-foreground")}>{place}</span>
      </span>
    </Link>
  )
}
