import type { Metadata } from "next"
import Link from "next/link"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { EventRow } from "@/components/events/event-row"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { query, type GriddEvent } from "@/lib/convex"
import { requirePublisherPage } from "@/lib/guards"
import { ui } from "@/lib/ui"
import { requestTime } from "@/lib/event-time"

export const metadata: Metadata = { title: "Mis eventos", robots: { index: false } }

/** Los eventos del organizador (`events.listMine`), separados en próximos, pasados y cancelados. */
export default async function PanelPage() {
  const { token, viewer } = await requirePublisherPage("/organizadores/panel")
  const events = await query<GriddEvent[]>("events:listMine", {}, token)

  // Se renderiza en cada request: la hora del server es la del pedido.
  const now = requestTime()
  const upcoming = events
    .filter((e) => e.status !== "cancelled" && e.endsAt >= now)
    .sort((a, b) => a.startsAt - b.startsAt)
  const past = events.filter((e) => e.status !== "cancelled" && e.endsAt < now)
  const cancelled = events.filter((e) => e.status === "cancelled")

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-5 pt-8 pb-16 sm:px-8">
        <PageHeader
          eyebrow={viewer.name ?? "Organizador"}
          title="Mis eventos"
          description="Publicá, editá o cancelá tus encuentros. Los cambios se ven al toque en la app."
          action={
            <Link href="/organizadores/panel/nuevo" className={`${ui.primary} py-3`}>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} aria-hidden className="size-5" />
              Publicar evento
            </Link>
          }
        />

        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-12 text-center">
            <p className="font-medium">Todavía no publicaste ningún evento</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Cuando publiques uno aparece en Inicio y en el mapa de la app, y en gridd.app/eventos.
            </p>
            <Link href="/organizadores/panel/nuevo" className={`${ui.primary} py-3`}>
              Publicar mi primer evento
            </Link>
          </div>
        ) : (
          <>
            <Group title="Próximos" events={upcoming} empty="No tenés eventos próximos." />
            {past.length > 0 && <Group title="Pasados" events={past} badge="Terminó" />}
            {cancelled.length > 0 && <Group title="Cancelados" events={cancelled} />}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

function Group({ title, events, empty, badge }: { title: string; events: GriddEvent[]; empty?: string; badge?: string }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[0.72rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {title} · {events.length}
      </h2>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event._id}>
              <EventRow
                event={event}
                directions={false}
                badge={
                  event.status === "hidden" ? (
                    <span className="text-destructive"> · Oculto por moderación</span>
                  ) : badge ? (
                    <span> · {badge}</span>
                  ) : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
