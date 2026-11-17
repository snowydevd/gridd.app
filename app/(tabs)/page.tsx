import type { Metadata } from "next"
import Link from "next/link"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

import { AccountCards } from "@/components/app/account-cards"
import { HomeFeed } from "@/components/app/home-feed"
import { ProfilePill, RadiusPill } from "@/components/app/home-header"
import { buttonClass, EmptyState } from "@/components/app/ui"
import { Wordmark } from "@/components/brand/wordmark"
import { getViewer, isPublisher, listUpcomingEvents, query, type Car, type GriddEvent } from "@/lib/convex"
import { legalNav } from "@/lib/legal"
import { DEFAULT_SEARCH_RADIUS } from "@/lib/search-radius"
import { pageToken } from "@/lib/session"
import { site } from "@/lib/site"

// Inicio, como la pestaña de la app (mobile/src/app/(tabs)/index.tsx): el destacado, "Para vos", "Vas a
// ir" y "Completá tu cuenta". En iPhone, mientras no esté la app, esto es la app.
export const metadata: Metadata = {
  title: { absolute: "GRIDD — Encuentros fierreros de Uruguay" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "GRIDD",
    locale: "es_UY",
    type: "website",
    title: "GRIDD — Encuentros fierreros de Uruguay",
    description: site.description,
    url: "/",
  },
}

/** Cuántos trae Inicio: el destacado y la base de "Para vos" (HOME_EVENTS en la app). */
const HOME_EVENTS = 20

export default async function HomePage() {
  const token = await pageToken("/")
  const [{ events, now }, viewer] = await Promise.all([listUpcomingEvents(HOME_EVENTS), getViewer(token)])
  const signedIn = !!token && !!viewer
  const [attending, cars] = signedIn
    ? await Promise.all([
        query<GriddEvent[]>("attendance:myEvents", {}, token).catch(() => [] as GriddEvent[]),
        query<Car[]>("cars:listMine", {}, token).catch(() => [] as Car[]),
      ])
    : [[] as GriddEvent[], [] as Car[]]
  const going = attending.filter((e) => e.endsAt >= now)

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-8">
      <h1 className="sr-only">Próximos encuentros fierreros en Uruguay</h1>
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" aria-label="Gridd — inicio" className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60">
          <Wordmark className="h-[22px] text-foreground" />
        </Link>
        <div className="flex items-center gap-2">
          <RadiusPill radius={viewer?.searchRadius ?? DEFAULT_SEARCH_RADIUS} signedIn={signedIn} />
          <ProfilePill viewer={viewer} />
        </div>
      </header>

      {events.length === 0 ? (
        <div className="flex h-[380px] flex-col items-center justify-center rounded-[16px] border border-border">
          <EmptyState
            icon={Calendar03Icon}
            title="No hay encuentros próximos"
            action={
              viewer && isPublisher(viewer) ? (
                <Link href="/organizadores/panel/nuevo" className={buttonClass("primary")}>
                  Publicar evento
                </Link>
              ) : undefined
            }
          >
            {viewer && isPublisher(viewer) ? "Sé el primero en publicar uno." : "Volvé en un rato, se publican seguido."}
          </EmptyState>
        </div>
      ) : (
        <HomeFeed
          events={events}
          going={going}
          now={now}
          interests={viewer?.interests ?? []}
          radius={viewer?.searchRadius ?? DEFAULT_SEARCH_RADIUS}
        />
      )}

      <AccountCards
        viewer={viewer ? { hasImage: !!viewer.image, interests: viewer.interests.length } : null}
        hasCar={cars.length > 0}
        hasJoinedAny={attending.length > 0}
      />

      <nav aria-label="Sobre Gridd" className="mt-12 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link href="/nosotros" className="hover:text-foreground">
          Qué es Gridd
        </Link>
        {legalNav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  )
}
