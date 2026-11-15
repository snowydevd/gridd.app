"use client"

import { useMemo, useState } from "react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { EventRow } from "@/components/events/event-row"
import { KIND_LABELS, type GriddEvent } from "@/lib/convex"
import { filterEvents, type When } from "@/lib/event-filters"
import { cn } from "@/lib/utils"

const WHEN: { value: When; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "today", label: "Hoy" },
  { value: "weekend", label: "Este finde" },
]

/**
 * Buscador y lista de próximos encuentros. Los eventos llegan del server (`/eventos`); filtrar es
 * local. `now` también viene del server para que "Hoy" dé lo mismo en el HTML y al hidratar.
 */
export function EventsBrowser({ events, now }: { events: GriddEvent[]; now: number }) {
  const [text, setText] = useState("")
  const [kind, setKind] = useState<string | null>(null)
  const [when, setWhen] = useState<When>("all")

  // Sólo las categorías que tienen eventos: un chip que no trae nada confunde.
  const kinds = useMemo(
    () => Object.keys(KIND_LABELS).filter((k) => events.some((e) => e.kind === k)),
    [events]
  )
  const visible = filterEvents(events, { text, kind, when }, now)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Buscar encuentros</span>
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={1.8}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Buscá por nombre o lugar"
            className="h-12 w-full rounded-4xl border border-border bg-input/30 pr-4 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </label>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Cuándo">
          {WHEN.map((w) => (
            <Chip key={w.value} active={when === w.value} onClick={() => setWhen(w.value)}>
              {w.label}
            </Chip>
          ))}
        </div>

        {kinds.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Categoría">
            <Chip active={!kind} onClick={() => setKind(null)}>
              Todas
            </Chip>
            {kinds.map((k) => (
              <Chip key={k} active={kind === k} onClick={() => setKind(kind === k ? null : k)}>
                {KIND_LABELS[k]}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-3xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          {events.length === 0
            ? "Todavía no hay encuentros publicados. Volvé en unos días."
            : "No hay encuentros con esos filtros."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((event) => (
            <li key={event._id}>
              <EventRow event={event} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active ? "bg-brand text-brand-foreground" : "border border-border bg-input/30 text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}
