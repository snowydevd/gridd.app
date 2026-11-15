import Link from "next/link"
import { Calendar03Icon, Location01Icon, Navigation03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Wordmark } from "@/components/brand/wordmark"
import { KIND_LABELS, type GriddEvent } from "@/lib/convex"
import { directionsUrl } from "@/lib/maps"

const TZ = "America/Montevideo"
const dayFmt = new Intl.DateTimeFormat("es-UY", { weekday: "short", day: "numeric", month: "short", timeZone: TZ })
const timeFmt = new Intl.DateTimeFormat("es-UY", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ })

/**
 * Fila de un evento: toda la tarjeta abre la ficha (`href`, por defecto `/e/<slug>`) y, a la derecha,
 * "Cómo llegar" abre Google Maps. Son dos links hermanos: un `<a>` no puede ir adentro de otro.
 * `badge` reemplaza la etiqueta de estado (p. ej. "Terminó" en el panel del organizador).
 */
export function EventRow({
  event,
  href = `/e/${event.slug}`,
  badge,
  directions = true,
}: {
  event: GriddEvent
  href?: string
  badge?: React.ReactNode
  directions?: boolean
}) {
  const day = dayFmt.format(event.startsAt).replace(/\./g, "")
  const time = timeFmt.format(event.startsAt)
  const cancelled = event.status === "cancelled"
  return (
    <div className="group relative flex items-center gap-4 rounded-3xl border border-border bg-card p-3 pr-4 transition-colors hover:bg-input/30 has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50">
      <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-24">
        {event.imageUrl ? (
          // Viene del storage de Convex: no pasa por el optimizador de imágenes.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Wordmark className="h-3 text-muted-foreground" mono />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {KIND_LABELS[event.kind] ?? "Encuentro"}
          {badge ?? (cancelled && <span className="text-destructive"> · Cancelado</span>)}
        </span>
        {/* El link se estira sobre toda la tarjeta (after:absolute); "Cómo llegar" queda arriba. */}
        <Link
          href={href}
          className="truncate font-medium outline-none group-hover:underline after:absolute after:inset-0 after:rounded-3xl"
        >
          {event.title}
        </Link>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.8} aria-hidden className="size-3.5 shrink-0" />
          <span className="capitalize">{day}</span> · {time} hs
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <HugeiconsIcon icon={Location01Icon} strokeWidth={1.8} aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">{event.placeName}</span>
        </span>
      </div>
      {directions && !cancelled && (
        <a
          href={directionsUrl(event.lat, event.lon)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Cómo llegar a ${event.placeName}`}
          title="Cómo llegar"
          className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-brand outline-none hover:bg-input/30 focus-visible:ring-[3px] focus-visible:ring-brand/40"
        >
          <HugeiconsIcon icon={Navigation03Icon} strokeWidth={1.8} aria-hidden className="size-5" />
        </a>
      )}
    </div>
  )
}
