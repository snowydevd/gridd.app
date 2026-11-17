"use client"

import Link from "next/link"

import { Tag, text } from "@/components/app/ui"
import type { GriddEvent } from "@/lib/convex"
import { DEFAULT_COVER, whenLabel } from "@/lib/event-format"
import { distanceKm, formatKm } from "@/lib/search-radius"
import { useKnownLocation } from "@/lib/use-location"
import { cn } from "@/lib/utils"

/**
 * Tarjetas de eventos de la app (mobile/src/components/event-card.tsx): la fila compacta, la grilla de
 * fotos y el destacado de Inicio. Son de cliente para mostrar la distancia si ya hay permiso de
 * ubicación. `now` viene del server, así el HTML y la hidratación dicen lo mismo ("Hoy", "Mañana").
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
      <span className="size-[72px] shrink-0 overflow-hidden rounded-[12px] bg-raised">
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

/**
 * Grilla de dos columnas, el escalón entre el destacado y las filas. Con cantidad impar la primera va
 * a todo el ancho, así nunca queda un hueco.
 */
export function EventGrid({ events, now }: { events: GriddEvent[]; now: number }) {
  const wide = events.length % 2 === 1 ? events[0] : undefined
  const rest = wide ? events.slice(1) : events
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      {wide && <GridTile event={wide} now={now} wide />}
      {rest.map((event) => (
        <GridTile key={event._id} event={event} now={now} />
      ))}
    </div>
  )
}

function GridTile({ event, now, wide }: { event: GriddEvent; now: number; wide?: boolean }) {
  const when = whenLabel(event, now)
  const place = usePlaceLine(event)
  return (
    <Link
      href={`/e/${event.slug}`}
      className={cn("flex min-w-0 flex-col outline-none active:opacity-70 focus-visible:ring-[3px] focus-visible:ring-ring/60", wide && "col-span-2")}
    >
      <span className={cn("relative block overflow-hidden rounded-[16px] bg-raised", wide ? "aspect-video" : "aspect-[4/3]")}>
        <Cover event={event} />
        <span className="absolute top-3 left-3">
          <Tag tone={when.isToday ? "accent" : "default"} overlay>
            {when.day}
          </Tag>
        </span>
      </span>
      <span className={cn(text.heading, "mt-2 truncate")}>{event.title}</span>
      <span className={cn(text.caption, "truncate text-muted-foreground")}>{place}</span>
    </Link>
  )
}

/** El próximo encuentro, a toda la foto. Oscuro en los dos temas (`DarkScope` en la app). */
export function FeaturedCard({ event, now }: { event: GriddEvent; now: number }) {
  const when = whenLabel(event, now)
  const place = usePlaceLine(event)
  return (
    <Link
      href={`/e/${event.slug}`}
      data-theme="dark"
      className="relative flex h-[380px] flex-col justify-between overflow-hidden rounded-[16px] bg-card text-foreground outline-none active:opacity-85 focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <span className="absolute inset-0">
        <Cover event={event} eager />
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-[35%] bottom-0"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(11,11,12,0.43) 47%, rgba(11,11,12,0.95) 100%)" }}
      />
      <span className="relative p-4">
        <Tag tone="accent">{when.isToday ? "Hoy" : "Próximo"}</Tag>
      </span>
      <span className="relative flex flex-col gap-1 p-4">
        <WhenLine event={event} now={now} />
        <span className={cn(text.display, "line-clamp-2")}>{event.title}</span>
        <span className={cn(text.label, "truncate text-muted-foreground")}>{place}</span>
      </span>
    </Link>
  )
}
