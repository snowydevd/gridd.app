import Link from "next/link"
import { Navigation03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { GriddEvent } from "@/lib/convex"
import { DEFAULT_COVER, whenLabel, type When } from "@/lib/event-format"
import { directionsUrl } from "@/lib/maps"
import { cn } from "@/lib/utils"

/**
 * Las tarjetas de Inicio, como mobile/src/components/event-card.tsx: el destacado grande, la grilla
 * de fotos y las filas compactas. Server components: `now` viene de la página.
 */

function Cover({ event, className }: { event: GriddEvent; className?: string }) {
  return (
    // Viene del storage de Convex: no pasa por el optimizador de imágenes.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={event.imageUrl ?? DEFAULT_COVER}
      alt=""
      loading="lazy"
      className={cn("size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]", className)}
    />
  )
}

/** "Hoy · 21:00" con un punto fluor cuando es hoy (el acento sólo para lo de hoy, como en la app). */
export function WhenLine({ when, className }: { when: When; className?: string }) {
  const accent = when.isToday || when.isNow
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.12em] uppercase",
        accent ? "text-brand" : "text-muted-foreground",
        className
      )}
    >
      {accent && <span aria-hidden className="size-1.5 rounded-full bg-brand" />}
      {when.isNow ? "Ahora" : when.day} · {when.time}
    </span>
  )
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em] uppercase backdrop-blur-md",
        accent ? "bg-brand text-brand-foreground" : "bg-black/45 text-white"
      )}
    >
      {children}
    </span>
  )
}

/** El próximo encuentro, a toda la foto. */
export function FeaturedCard({ event, now }: { event: GriddEvent; now: number }) {
  const when = whenLabel(event, now)
  return (
    <article className="group relative flex h-[26rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-card sm:h-[30rem]">
      <div className="absolute inset-0">
        <Cover event={event} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent to-65%" />
      <div className="relative flex items-start justify-between p-5">
        <Tag accent>{when.isNow ? "Ahora" : when.isToday ? "Hoy" : "Próximo"}</Tag>
        <DirectionsButton event={event} overlay />
      </div>
      <div className="relative flex flex-col gap-2 p-5 pt-0 text-white sm:p-7">
        <WhenLine when={when} className={when.isToday || when.isNow ? undefined : "text-white/70"} />
        {/* El link se estira sobre la tarjeta; "Cómo llegar" queda por encima. */}
        <Link
          href={`/e/${event.slug}`}
          className="font-heading text-[clamp(1.9rem,6vw,2.75rem)] leading-[1.02] tracking-[-0.02em] text-balance uppercase outline-none after:absolute after:inset-0 after:rounded-[2rem] focus-visible:after:ring-[3px] focus-visible:after:ring-brand/60"
        >
          {event.title}
        </Link>
        <span className="truncate text-sm text-white/70">{event.placeName}</span>
      </div>
    </article>
  )
}

/**
 * Grilla de dos columnas, el escalón entre el destacado y las filas. Con cantidad impar la primera va
 * a todo el ancho, así nunca queda un hueco (igual que `EventGrid` en la app).
 */
export function EventGrid({ events, now }: { events: GriddEvent[]; now: number }) {
  const wide = events.length % 2 === 1 ? events[0] : undefined
  const rest = wide ? events.slice(1) : events
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4">
      {wide && (
        <li className="col-span-2">
          <GridTile event={wide} now={now} wide />
        </li>
      )}
      {rest.map((event) => (
        <li key={event._id}>
          <GridTile event={event} now={now} />
        </li>
      ))}
    </ul>
  )
}

function GridTile({ event, now, wide }: { event: GriddEvent; now: number; wide?: boolean }) {
  const when = whenLabel(event, now)
  return (
    <article className="group relative flex flex-col gap-2">
      <div className={cn("relative overflow-hidden rounded-3xl bg-muted", wide ? "aspect-[16/9]" : "aspect-[4/3]")}>
        <Cover event={event} />
        <div className="absolute top-3 left-3">
          <Tag accent={when.isToday || when.isNow}>{when.isNow ? "Ahora" : when.day}</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <Link
          href={`/e/${event.slug}`}
          className="truncate font-medium outline-none group-hover:underline after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
        >
          {event.title}
        </Link>
        <span className="truncate text-sm text-muted-foreground">
          {when.time} hs · {event.placeName}
        </span>
      </div>
    </article>
  )
}

/** Fila compacta: miniatura, cuándo, título y lugar. Un cancelado queda atenuado. */
export function CompactRow({ event, now }: { event: GriddEvent; now: number }) {
  const when = whenLabel(event, now)
  const cancelled = event.status === "cancelled"
  return (
    <article className={cn("group relative flex items-center gap-4 py-2", cancelled && "opacity-50")}>
      <div className="size-18 shrink-0 overflow-hidden rounded-2xl bg-muted">
        <Cover event={event} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {cancelled ? (
          <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-destructive uppercase">Cancelado</span>
        ) : (
          <WhenLine when={when} />
        )}
        <Link
          href={`/e/${event.slug}`}
          className="truncate font-medium outline-none group-hover:underline after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
        >
          {event.title}
        </Link>
        <span className="truncate text-sm text-muted-foreground">{event.placeName}</span>
      </div>
      {!cancelled && <DirectionsButton event={event} />}
    </article>
  )
}

/** "Cómo llegar" a Google Maps. Va por encima del link estirado de la tarjeta (`relative z-10`). */
export function DirectionsButton({ event, overlay }: { event: GriddEvent; overlay?: boolean }) {
  return (
    <a
      href={directionsUrl(event.lat, event.lon)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Cómo llegar a ${event.placeName}`}
      title="Cómo llegar"
      className={cn(
        "relative z-10 flex shrink-0 items-center justify-center gap-1.5 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-brand/50",
        overlay
          ? "h-10 bg-black/45 px-4 text-sm font-medium text-white backdrop-blur-md hover:bg-black/60"
          : "size-11 border border-border bg-background text-brand hover:bg-input/30"
      )}
    >
      <HugeiconsIcon icon={Navigation03Icon} strokeWidth={1.8} aria-hidden className="size-4.5" />
      {overlay && "Cómo llegar"}
    </a>
  )
}
