import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight01Icon, Calendar03Icon, Camera01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Wordmark } from "@/components/brand/wordmark"
import { CompactRow, EventGrid, FeaturedCard } from "@/components/home/event-cards"
import { StoreButtons } from "@/components/landing/store-buttons"
import { SiteFooter } from "@/components/site-footer"
import { getViewer, isPublisher, listUpcomingEvents, query, type GriddEvent, type Viewer } from "@/lib/convex"
import { pageToken } from "@/lib/session"
import { site } from "@/lib/site"
import { ui } from "@/lib/ui"

// Inicio: los encuentros de una, sin pasar por la landing (que ahora está en /nosotros). Pensado para
// quien no tiene la app, sobre todo en iPhone. Mismo orden que la pantalla de Inicio de la app.
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
/** Impar a propósito: la grilla arranca con una a todo el ancho y después van de a pares. */
const FOR_YOU_SIZE = 7

export default async function HomePage() {
  const token = await pageToken("/")
  const [{ events, now }, viewer] = await Promise.all([listUpcomingEvents(HOME_EVENTS), getViewer(token)])
  const going =
    token && viewer
      ? (await query<GriddEvent[]>("attendance:myEvents", {}, token).catch(() => [])).filter((e) => e.endsAt >= now)
      : []

  const [featured, ...rest] = events
  // "Para vos": primero las categorías que le interesan y, dentro de cada grupo, por fecha.
  const interests = viewer?.interests ?? []
  const liked = (e: GriddEvent) => (interests.includes(e.kind) ? 0 : 1)
  const forYou = [...rest].sort((a, b) => liked(a) - liked(b) || a.startsAt - b.startsAt).slice(0, FOR_YOU_SIZE)

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            aria-label="Gridd — inicio"
            className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Wordmark className="h-4 text-foreground" />
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-2">
            <Link
              href="/eventos"
              className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium outline-none hover:bg-input/30 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.8} aria-hidden className="size-4 text-muted-foreground" />
              Todos
            </Link>
            <ProfilePill viewer={viewer} />
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-5 pt-2 pb-16 sm:px-8">
        <h1 className="sr-only">Próximos encuentros fierreros en Uruguay</h1>

        {featured ? (
          <FeaturedCard event={featured} now={now} />
        ) : (
          <div className="flex h-80 flex-col items-center justify-center gap-2 rounded-[2rem] border border-border bg-card p-8 text-center">
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.8} aria-hidden className="size-7 text-muted-foreground" />
            <p className="font-medium">No hay encuentros próximos</p>
            <p className="text-sm text-muted-foreground">
              {viewer && isPublisher(viewer) ? "Sé el primero en publicar uno." : "Volvé en un rato, se publican seguido."}
            </p>
            {viewer && isPublisher(viewer) && (
              <Link href="/organizadores/panel/nuevo" className={`${ui.primary} mt-3 py-3`}>
                Publicar evento
              </Link>
            )}
          </div>
        )}

        {forYou.length > 0 && (
          <Section title={interests.length > 0 ? "Para vos" : "Se vienen"} action={{ href: "/eventos", label: "Ver todo" }}>
            <EventGrid events={forYou} now={now} />
          </Section>
        )}

        {going.length > 0 && (
          <Section title="Vas a ir">
            <ul className="flex flex-col">
              {going.map((event) => (
                <li key={event._id}>
                  <CompactRow event={event} now={now} />
                </li>
              ))}
            </ul>
          </Section>
        )}

        {events.length > 0 && (
          <Link href="/eventos" className={ui.secondary}>
            Ver todos los encuentros
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} aria-hidden className="size-5" />
          </Link>
        )}

        <AccountCard viewer={viewer} />

        <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl tracking-[-0.01em]">Llevalo en el bolsillo</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            En la app ves el mapa, te avisamos de los encuentros cerca tuyo y armás tu garage.
          </p>
          <StoreButtons />
          <Link
            href="/nosotros"
            className="self-start text-sm font-medium text-foreground underline underline-offset-4 outline-none hover:text-brand focus-visible:text-brand"
          >
            Conocé Gridd →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: { href: string; label: string }
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl tracking-[-0.01em] uppercase">{title}</h2>
        {action && (
          <Link href={action.href} className="text-sm font-medium text-brand outline-none hover:underline focus-visible:underline">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

/** Foto del usuario; sin foto, sus iniciales con borde punteado (como `ProfilePill` en la app). */
function ProfilePill({ viewer }: { viewer: Viewer | null }) {
  if (!viewer) {
    return (
      <Link
        href="/ingresar"
        className="flex h-9 items-center rounded-full bg-brand px-4 text-sm font-medium text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40"
      >
        Ingresar
      </Link>
    )
  }
  const initials = (viewer.name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  return (
    <Link
      href="/perfil"
      aria-label="Ir a tu perfil"
      className={`flex size-9 items-center justify-center overflow-hidden rounded-full bg-card text-xs font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 ${viewer.image ? "" : "border-[1.5px] border-dashed border-brand"}`}
    >
      {viewer.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={viewer.image} alt="" className="size-full object-cover" />
      ) : (
        initials || "?"
      )}
    </Link>
  )
}

/** "Completá tu cuenta" de la app, reducido a lo que se puede hacer desde la web. */
function AccountCard({ viewer }: { viewer: Viewer | null }) {
  const step = !viewer
    ? { icon: UserAdd01Icon, title: "Creá tu cuenta", text: "Anotate a los encuentros y armá tu lista.", href: "/ingresar?modo=registro", action: "Crear" }
    : !viewer.image
      ? { icon: Camera01Icon, title: "Foto de perfil", text: "Que te reconozcan en los encuentros.", href: "/perfil", action: "Subir" }
      : null
  if (!step) return null
  return (
    <Link
      href={step.href}
      className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-5 outline-none hover:bg-input/30 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-brand">
        <HugeiconsIcon icon={step.icon} strokeWidth={1.8} aria-hidden className="size-6" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="font-medium">{step.title}</span>
        <span className="text-sm text-muted-foreground">{step.text}</span>
      </span>
      <span className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">{step.action}</span>
    </Link>
  )
}
