"use client"

import { useState } from "react"
import { Calendar03Icon, Search01Icon } from "@hugeicons/core-free-icons"

import { FeedAd } from "@/components/ads"
import { EventRow } from "@/components/app/event-cards"
import { chipClass, EmptyState, Icon } from "@/components/app/ui"
import { KIND_LABELS, type GriddEvent } from "@/lib/convex"
import { withAdSlots } from "@/lib/ads"
import { filterEvents } from "@/lib/event-filters"

const KINDS = Object.keys(KIND_LABELS)

/**
 * "Próximos encuentros" (mobile/src/app/events/index.tsx): chips de categoría y la lista por fecha.
 * En la web no se filtra por distancia y suma un buscador.
 */
export function EventsList({ events, now }: { events: GriddEvent[]; now: number }) {
  const [kind, setKind] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const visible = filterEvents(events, { text: query, kind, when: "all" }, now)

  return (
    <>
      <div className="mx-auto w-full max-w-xl px-4 pb-3">
        <label className="relative block">
          <span className="sr-only">Buscar encuentros</span>
          <Icon icon={Search01Icon} className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá por nombre o lugar"
            className="h-11 w-full rounded-full border border-border bg-card pr-4 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
        </label>
      </div>
      <div className="mx-auto flex w-full max-w-xl gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
        <button type="button" aria-pressed={!kind} onClick={() => setKind(null)} className={chipClass(!kind)}>
          Todos
        </button>
        {KINDS.map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chipClass(kind === k)}>
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        {visible.length === 0 ? (
          <EmptyState icon={Calendar03Icon} title="No hay encuentros">
            {query
              ? "No hay encuentros con esa búsqueda."
              : kind
                ? `No hay encuentros de ${KIND_LABELS[kind]} por ahora.`
                : "No hay encuentros por ahora."}
          </EmptyState>
        ) : (
          // Tarjetas de anuncio intercaladas (después del 5.º evento y una cada 6), como en la app.
          withAdSlots([visible])[0].map((item) =>
            item.kind === "ad" ? (
              <FeedAd key={item.key} variant="row" />
            ) : (
              <EventRow key={item.event._id} event={item.event} now={now} />
            )
          )
        )}
      </main>
    </>
  )
}
