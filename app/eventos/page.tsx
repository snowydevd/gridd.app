import type { Metadata } from "next"
import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { EventsBrowser } from "@/components/events/events-browser"
import { StoreButtons } from "@/components/landing/store-buttons"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { listUpcomingEvents } from "@/lib/convex"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Próximos encuentros",
  description:
    "Todos los encuentros fierreros que se vienen en Uruguay: rodadas, expos, cars & coffee y fechas de pista.",
  path: "/eventos",
})

// Lista pública de próximos encuentros, para quien no tiene la app (por ejemplo, en iPhone).
// Se pide en cada visita: un evento puede cancelarse o sumarse en cualquier momento.
export const dynamic = "force-dynamic"

export default async function EventosPage() {
  const { events, now } = await listUpcomingEvents()

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="flex h-14 items-center px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Gridd — inicio"
            className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Wordmark className="h-3.5 text-foreground" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 pt-8 pb-16 sm:px-8">
        <PageHeader
          eyebrow="Encuentros"
          title="Próximos encuentros"
          description="Tocá uno para ver dónde es, a qué hora y cómo llegar."
        />

        <EventsBrowser events={events} now={now} />

        <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl tracking-[-0.01em]">Anotate desde la app</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            En Gridd te anotás, guardás el encuentro y te enterás de los que se vienen cerca tuyo.
          </p>
          <StoreButtons />
          <Link
            href="/testers"
            className="self-start text-sm font-medium text-foreground underline underline-offset-4 outline-none hover:text-brand focus-visible:text-brand"
          >
            ¿Querés probarla antes? Sumate a la beta →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
