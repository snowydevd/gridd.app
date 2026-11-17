import type { Metadata } from "next"
import Link from "next/link"
import { Bookmark02Icon, Calendar03Icon } from "@hugeicons/core-free-icons"

import { EventRow } from "@/components/app/event-cards"
import { buttonClass, EmptyState, text } from "@/components/app/ui"
import { getViewer, isPublisher, query, type GriddEvent } from "@/lib/convex"
import { requestTime } from "@/lib/event-time"
import { pageToken } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Guardados", robots: { index: false } }

type Section = { label: string; events: GriddEvent[]; dimmed?: boolean }

/** Próximos del más cercano al más lejano; pasados del más reciente al más viejo. */
function splitByDate(list: GriddEvent[], now: number): Section[] {
  const byStart = (a: GriddEvent, b: GriddEvent) => a.startsAt - b.startsAt
  return [
    { label: "Próximos", events: list.filter((e) => e.endsAt >= now).sort(byStart) },
    { label: "Pasados", events: list.filter((e) => e.endsAt < now).sort((a, b) => byStart(b, a)), dimmed: true },
  ]
}

/**
 * La pestaña Guardados (mobile/src/app/(tabs)/saved.tsx). Un organizador tiene además "Mis eventos",
 * con los suyos y los cancelados aparte. El segmento va en la URL (`?ver=mios`).
 */
export default async function GuardadosPage({ searchParams }: PageProps<"/guardados">) {
  const { ver } = await searchParams
  const token = await pageToken("/guardados")
  const viewer = await getViewer(token)
  const publisher = !!viewer && isPublisher(viewer)
  const segment = publisher && ver === "mios" ? "mine" : "saved"
  const now = requestTime()

  let sections: Section[] = []
  if (token && viewer) {
    if (segment === "saved") {
      sections = splitByDate(await query<GriddEvent[]>("saves:mySaved", {}, token), now)
    } else {
      const mine = await query<GriddEvent[]>("events:listMine", {}, token)
      sections = [
        ...splitByDate(mine.filter((e) => e.status === "published"), now),
        // Los cancelados (u ocultos por moderación) van aparte para no confundirlos con los próximos.
        { label: "Cancelados", events: mine.filter((e) => e.status !== "published"), dimmed: true },
      ]
    }
  }
  const isEmpty = sections.every((s) => s.events.length === 0)

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-8">
      <h1 className={cn(text.display, "mb-6")}>Guardados</h1>

      {publisher && (
        <nav aria-label="Ver" className="flex rounded-full border border-border bg-card p-1">
          <Segment href="/guardados" active={segment === "saved"} label="Guardados" />
          <Segment href="/guardados?ver=mios" active={segment === "mine"} label="Mis eventos" />
        </nav>
      )}

      {isEmpty ? (
        segment === "mine" ? (
          <EmptyState
            icon={Calendar03Icon}
            title="Todavía no publicaste nada"
            action={
              <Link href="/organizadores/panel/nuevo" className={buttonClass("primary")}>
                Publicar evento
              </Link>
            }
          >
            Armá tu primer encuentro en menos de un minuto.
          </EmptyState>
        ) : (
          <EmptyState
            icon={Bookmark02Icon}
            title="Nada guardado"
            action={
              !viewer ? (
                <Link href="/ingresar?next=/guardados" className={buttonClass("primary")}>
                  Iniciar sesión
                </Link>
              ) : undefined
            }
          >
            {viewer ? "Guardá encuentros para tenerlos a mano." : "Entrá a tu cuenta para guardar encuentros."}
          </EmptyState>
        )
      ) : (
        sections.map(
          (section) =>
            section.events.length > 0 && (
              <section key={section.label} className="mt-6">
                <h2 className={cn(text.overline, "mb-1 text-muted-foreground")}>{section.label}</h2>
                {section.events.map((event) => (
                  <EventRow key={event._id} event={event} now={now} dimmed={section.dimmed} />
                ))}
              </section>
            )
        )
      )}
    </main>
  )
}

function Segment({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      replace
      aria-current={active ? "page" : undefined}
      className={cn(
        text.label,
        "flex h-[38px] flex-1 items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
        active ? "bg-raised text-foreground" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  )
}
