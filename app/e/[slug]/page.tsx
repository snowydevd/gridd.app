import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Calendar03Icon,
  Location01Icon,
  Navigation03Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Wordmark } from "@/components/brand/wordmark"
import { StoreButtons } from "@/components/landing/store-buttons"
import { SiteFooter } from "@/components/site-footer"
import { getEvent, KIND_LABELS, type GriddEvent } from "@/lib/convex"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

// La página que abre un link compartido desde la app (gridd.app/e/<slug>). Con la app instalada,
// el link la abre directo (Universal Links / App Links) y esta página no se ve.

const TZ = "America/Montevideo"

const dayFmt = new Intl.DateTimeFormat("es-UY", { weekday: "long", day: "numeric", month: "long", timeZone: TZ })
const timeFmt = new Intl.DateTimeFormat("es-UY", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ })

function when(event: GriddEvent) {
  const day = dayFmt.format(event.startsAt)
  const start = timeFmt.format(event.startsAt)
  const hours = event.noEndTime ? `${start} hs` : `${start} – ${timeFmt.format(event.endsAt)} hs`
  // Se renderiza en cada request: la hora del server es la del pedido.
  const ended = event.status !== "cancelled" && event.endsAt < Date.now()
  return { day: day.charAt(0).toUpperCase() + day.slice(1), hours, ended }
}

export async function generateMetadata({ params }: PageProps<"/e/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: "Evento no encontrado", robots: { index: false } }

  const { day, hours } = when(event)
  const description = `${day} · ${hours} · ${event.placeName}`
  return {
    title: event.title,
    description,
    alternates: { canonical: `/e/${slug}` },
    openGraph: {
      siteName: site.name.toUpperCase(),
      locale: site.locale.replace("-", "_"),
      type: "website",
      url: `/e/${slug}`,
      title: event.title,
      description,
      // Sin portada, WhatsApp e Instagram muestran la del sitio.
      images: event.imageUrl ? [{ url: event.imageUrl }] : undefined,
    },
  }
}

export default async function EventPage({ params }: PageProps<"/e/[slug]">) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const { day, hours, ended } = when(event)
  const cancelled = event.status === "cancelled"
  const directions = `https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lon}`
  const organizer = event.organizer?.name ?? "Organizador"

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Gridd — inicio"
            className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Wordmark className="h-3.5 text-foreground" />
          </Link>
          {/* Si el link no abrió la app sola (p. ej. desde el navegador de Instagram), esto la abre. */}
          <a
            href={`gridd://event/${slug}`}
            className="rounded-4xl bg-brand px-4 py-2 text-sm font-medium text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40"
          >
            Abrir en la app
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 pt-6 pb-16 sm:px-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-muted">
          {event.imageUrl ? (
            // Viene del storage de Convex: no pasa por el optimizador de imágenes.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Wordmark className="h-8 text-muted-foreground" mono />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Tag>{KIND_LABELS[event.kind] ?? "Encuentro"}</Tag>
            {cancelled && <Tag tone="danger">Cancelado</Tag>}
            {ended && <Tag>Terminó</Tag>}
          </div>
          <h1 className="text-[clamp(2rem,6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-balance">
            {event.title}
          </h1>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.8} aria-hidden className="size-4" />
            {event.attendeeCount === 1 ? "Va 1 persona" : `Van ${event.attendeeCount} personas`}
          </p>
        </div>

        {cancelled && (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm">
            El organizador canceló este encuentro.
          </p>
        )}

        <div className="divide-y divide-border rounded-3xl border border-border bg-card px-5">
          <Fact icon={Calendar03Icon} title={day} subtitle={hours} />
          <Fact icon={Location01Icon} title={event.placeName}>
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand outline-none hover:underline focus-visible:underline"
            >
              <HugeiconsIcon icon={Navigation03Icon} strokeWidth={1.8} aria-hidden className="size-4" />
              Cómo llegar
            </a>
          </Fact>
        </div>

        {event.description && (
          <p className="text-base leading-7 whitespace-pre-line text-muted-foreground">{event.description}</p>
        )}

        <div className="flex items-center gap-3 border-t border-border pt-6">
          {event.organizer?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.organizer.image} alt="" className="size-11 rounded-full object-cover" />
          ) : (
            <div className="flex size-11 items-center justify-center rounded-full bg-muted text-xs font-semibold text-brand">
              {organizer.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Organiza</span>
            <span className="font-medium">{organizer}</span>
          </div>
        </div>

        <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl tracking-[-0.01em]">Anotate desde la app</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            En Gridd te anotás, guardás el encuentro y te enterás de los que se vienen cerca tuyo.
          </p>
          <StoreButtons />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Tag({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "danger" }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em] uppercase",
        tone === "danger" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

function Fact({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Calendar03Icon
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4 py-5">
      <HugeiconsIcon icon={icon} strokeWidth={1.8} aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <span className="font-medium">{title}</span>
        {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
        {children}
      </div>
    </div>
  )
}
