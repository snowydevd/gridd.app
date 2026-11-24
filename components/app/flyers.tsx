"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { FeedAd } from "@/components/ads"
import { usePlaceLine, WhenLine } from "@/components/app/event-cards"
import { Tag, text } from "@/components/app/ui"
import { withAdSlots, type Slotted } from "@/lib/ads"
import type { GriddEvent } from "@/lib/convex"
import { DEFAULT_COVER, whenLabel } from "@/lib/event-format"
import { aspectOf, clampAspect, FLYER_TEXT_HEIGHT, flyerFit, splitColumns } from "@/lib/flyer-layout"
import { cn } from "@/lib/utils"

/**
 * Flyers con su forma real, como en la app (mobile/src/components/flyer-*.tsx): el carrusel "Para
 * vos" y la grilla tipo Pinterest de "Todos los eventos" y "Próximos encuentros".
 */

const flyerAspect = (event: GriddEvent) => aspectOf(event.imageWidth, event.imageHeight)

type Badge = { label: string; accent?: boolean } | null

/**
 * El flyer dentro de su caja. `fit="cover"` cuando la caja tiene la forma del flyer (no corta nada);
 * si no, entero con `contain` sobre el mismo flyer desenfocado.
 */
function FlyerImage({ event, fit, badge, eager }: { event: GriddEvent; fit: "cover" | "contain"; badge: Badge; eager?: boolean }) {
  const src = event.imageUrl ?? DEFAULT_COVER
  return (
    <>
      {fit === "contain" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover blur-xl" />
      )}
      {/* Viene del storage de Convex: no pasa por el optimizador de imágenes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading={eager ? "eager" : "lazy"}
        className={cn("absolute inset-0 size-full", fit === "cover" ? "object-cover" : "object-contain")}
      />
      {badge && (
        <span className="absolute top-3 left-3">
          <Tag tone={badge.accent ? "accent" : "default"} overlay>
            {badge.label}
          </Tag>
        </span>
      )}
    </>
  )
}

/** Tarjeta de la grilla: el flyer con su forma y, debajo, nombre y lugar. */
function FlyerCard({ event, now }: { event: GriddEvent; now: number }) {
  const aspect = flyerAspect(event)
  const shown = clampAspect(aspect)
  const when = whenLabel(event, now)
  const place = usePlaceLine(event)
  return (
    <Link
      href={`/e/${event.slug}`}
      className="flex min-w-0 flex-col outline-none active:opacity-70 focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <span className="relative block overflow-hidden rounded-[16px] bg-raised" style={{ aspectRatio: shown }}>
        <FlyerImage event={event} fit={flyerFit(aspect, shown)} badge={{ label: when.day, accent: when.isToday }} />
      </span>
      <span className="flex flex-col pt-2" style={{ minHeight: FLYER_TEXT_HEIGHT }}>
        <span className={cn(text.heading, "truncate")}>{event.title}</span>
        <span className={cn(text.caption, "truncate text-muted-foreground")}>{place}</span>
      </span>
    </Link>
  )
}

/** Separación entre tarjetas (gap-3). */
const GAP = 12
/**
 * Ancho de columna con el que se calcula el reparto. Es fijo para que el server y el navegador repartan
 * igual (sin saltos al hidratar); el ancho real sólo cambia cuánto pesa el texto, que es poco.
 */
const NOMINAL_COLUMN = 270

/**
 * Grilla de dos columnas tipo Pinterest: cada flyer con su forma, en orden, a la columna más corta.
 * Las alturas salen de las medidas guardadas, así no se reacomoda mientras cargan las imágenes. Las
 * tarjetas de anuncio van como un ítem más (después del 5.º evento y una cada 6); no cuentan para el
 * reparto porque no se sabe si van a cargar.
 */
export function FlyerGrid({ events, now }: { events: GriddEvent[]; now: number }) {
  const items = withAdSlots([events])[0]
  const heightOf = (item: Slotted<GriddEvent>) =>
    item.kind === "ad" ? 0 : NOMINAL_COLUMN / clampAspect(flyerAspect(item.event)) + FLYER_TEXT_HEIGHT
  const columns = splitColumns(items, heightOf, GAP)
  return (
    <div className="flex items-start gap-3">
      {columns.map((col, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-3">
          {col.map((item) =>
            item.kind === "ad" ? (
              <FeedAd key={item.key} variant="tile" />
            ) : (
              <FlyerCard key={item.event._id} event={item.event} now={now} />
            )
          )}
        </div>
      ))}
    </div>
  )
}

/** Cuántos suma "Todos los eventos" cada vez que se llega al final. */
const PAGE = 24

/** La grilla que va mostrando más eventos a medida que se scrollea (carga infinita de la app). */
export function InfiniteFlyerGrid({ events, now }: { events: GriddEvent[]; now: number }) {
  const [shown, setShown] = useState(PAGE)
  const sentinel = useRef<HTMLDivElement>(null)
  const more = shown < events.length

  useEffect(() => {
    if (!more || !sentinel.current) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShown((n) => n + PAGE),
      { rootMargin: "600px 0px" }
    )
    observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [more, shown])

  return (
    <>
      <FlyerGrid events={events.slice(0, shown)} now={now} />
      {more && (
        <div ref={sentinel} className="flex justify-center py-6" aria-hidden>
          <span className="size-6 animate-spin rounded-full border-2 border-brand-text border-t-transparent" />
        </div>
      )}
    </>
  )
}

/** Alto del flyer en cada slide del carrusel. */
const CAROUSEL_HEIGHT = 400
/** Cada cuánto pasa sola a la slide siguiente. */
const AUTOPLAY_MS = 3000

/**
 * Carrusel horizontal de flyers grandes ("Para vos"), un evento por slide y todas del mismo alto: el
 * flyer se ve entero sobre el mismo flyer desenfocado. Avanza solo cada `AUTOPLAY_MS` (de la última
 * vuelve a la primera); se frena mientras se toca o se pasa el mouse, con la pestaña oculta y con
 * "reducir movimiento".
 */
export function FlyerCarousel({
  events,
  now,
  badge,
}: {
  events: GriddEvent[]
  now: number
  badge?: (event: GriddEvent, index: number) => Badge | undefined
}) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = track.current
    if (!el || events.length < 2 || paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setTimeout(() => {
      if (document.visibilityState !== "visible") return
      el.scrollTo({ left: ((active + 1) % events.length) * el.clientWidth, behavior: "smooth" })
    }, AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [active, paused, events.length])

  const onScroll = () => {
    const el = track.current
    if (!el || el.clientWidth === 0) return
    setActive(Math.min(events.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))))
  }

  const goTo = (i: number) => {
    const el = track.current
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event, i) => (
          <CarouselSlide key={event._id} event={event} now={now} badge={badge?.(event, i)} eager={i === 0} />
        ))}
      </div>
      {events.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {events.map((event, i) => (
            <button
              key={event._id}
              type="button"
              aria-label={`Ver ${event.title}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-[18px] bg-brand-text" : "w-1.5 bg-border"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CarouselSlide({ event, now, badge, eager }: { event: GriddEvent; now: number; badge?: Badge; eager: boolean }) {
  const when = whenLabel(event, now)
  const place = usePlaceLine(event)
  return (
    <Link
      href={`/e/${event.slug}`}
      className="flex w-full shrink-0 snap-center flex-col outline-none active:opacity-70 focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <span className="relative block overflow-hidden rounded-[16px] bg-raised" style={{ height: CAROUSEL_HEIGHT }}>
        {/* El ancho de la slide se conoce recién en el navegador: siempre `contain` sobre el relleno, que
            con la forma justa se ve igual que `cover`. */}
        <FlyerImage
          event={event}
          fit="contain"
          eager={eager}
          badge={badge === undefined ? { label: when.day, accent: when.isToday } : badge}
        />
      </span>
      <span className="flex flex-col gap-0.5 pt-2">
        <WhenLine event={event} now={now} />
        <span className={cn(text.heading, "truncate")}>{event.title}</span>
        <span className={cn(text.caption, "truncate text-muted-foreground")}>{place}</span>
      </span>
    </Link>
  )
}
