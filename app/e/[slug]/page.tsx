import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  HandHeartIcon,
  Location01Icon,
  Ticket01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import { EventActionBar, EventPlaceMap, EventTopBar } from "@/components/app/event-detail"
import { Card, Fade, Icon, Tag, text } from "@/components/app/ui"
import { getEvent, getEventAs, getOrganizer, getViewer, KIND_LABELS, query, type Attendee, type GriddEvent } from "@/lib/convex"
import { DEFAULT_COVER, whenLabel } from "@/lib/event-format"
import { requestTime } from "@/lib/event-time"
import { aspectOf, clampAspect } from "@/lib/flyer-layout"
import { pageToken } from "@/lib/session"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

// La ficha de un evento (mobile/src/app/event/[id].tsx), y el destino de los links compartidos
// (gridd.app/e/<slug>). En Android, con la app instalada, el link la abre directo (App Links).

const TZ = "America/Montevideo"
const dayFmt = new Intl.DateTimeFormat("es-UY", { weekday: "long", day: "numeric", month: "long", timeZone: TZ })
const timeFmt = new Intl.DateTimeFormat("es-UY", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ })

function when(event: GriddEvent, now: number) {
  const long = dayFmt.format(event.startsAt).replace(",", "")
  const isToday = whenLabel(event, now).isToday
  const start = timeFmt.format(event.startsAt)
  const hours = event.noEndTime ? `${start} hs` : `${start} – ${timeFmt.format(event.endsAt)} hs`
  const ended = event.status !== "cancelled" && event.endsAt < now
  // "Hoy, martes 27 de octubre", como la app.
  const day = isToday ? `Hoy, ${long}` : long.charAt(0).toUpperCase() + long.slice(1)
  return { day, hours, ended, isToday }
}

export async function generateMetadata({ params }: PageProps<"/e/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: "Evento no encontrado", robots: { index: false } }

  const { day, hours } = when(event, Date.now())
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

const MAX_FACES = 5

export default async function EventPage({ params }: PageProps<"/e/[slug]">) {
  const { slug } = await params
  const token = await pageToken(`/e/${slug}`)
  // Con sesión se pide como el usuario: el organizador ve también su evento oculto.
  const event = token ? await getEventAs(slug, token) : await getEvent(slug)
  if (!event) notFound()

  const viewer = token ? await getViewer(token) : null
  const signedIn = !!token && !!viewer
  const [attending, saved, attendees] = signedIn
    ? await Promise.all([
        query<boolean>("attendance:isAttending", { eventId: event._id }, token).catch(() => false),
        query<boolean>("saves:isSaved", { eventId: event._id }, token).catch(() => false),
        query<Attendee[]>("attendance:list", { eventId: event._id }, token).catch(() => null),
      ])
    : [false, false, null]

  // Sólo se linkea al perfil si existe: un organizador que dejó de serlo no tiene perfil público.
  const hasProfile = event.organizer ? (await getOrganizer(event.organizer._id, token)) !== null : false

  // Se renderiza en cada request: la hora del server es la del pedido.
  const now = requestTime()
  const { day, hours, ended, isToday } = when(event, now)
  const cancelled = event.status === "cancelled"
  const isOpen = event.status === "published" && !ended
  const isOrganizer = !!viewer && event.organizer?._id === viewer._id
  const organizerName = event.organizer?.name ?? "Organizador"
  const short = whenLabel(event, now)
  // Android con la app instalada abre el link solo; si no (p. ej. desde Instagram), esto la abre.
  const android = /Android/i.test((await headers()).get("user-agent") ?? "")

  const detail = {
    _id: event._id,
    slug,
    title: event.title,
    placeName: event.placeName,
    lat: event.lat,
    lon: event.lon,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    attendeeCount: event.attendeeCount,
    shareWhen: `${short.day} ${short.time} hs`,
  }
  const faces = attendees?.slice(0, MAX_FACES) ?? []
  // Sin `entryCost` la entrada es libre (o el evento es anterior a este campo): no se dice nada.
  const price = event.paidEvent && event.entryCost ? `$${event.entryCost.toLocaleString("es-UY")}` : null
  const cover = event.imageUrl ?? DEFAULT_COVER

  return (
    <div className="relative min-h-dvh pb-[calc(env(safe-area-inset-bottom)+6.5rem)]">
      {/* El flyer entero, a todo el ancho y con su forma, hasta el 70% del alto de pantalla. Si se pasa
          (o la forma está fuera del rango), entero sobre el mismo flyer desenfocado. */}
      <div
        className="relative mx-auto max-h-[70dvh] w-full max-w-xl overflow-hidden bg-card sm:mt-4 sm:rounded-[16px]"
        style={{ aspectRatio: clampAspect(aspectOf(event.imageWidth, event.imageHeight)) }}
      >
        {/* Viene del storage de Convex: no pasa por el optimizador de imágenes. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover blur-xl" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="absolute inset-0 size-full object-contain" />
        {/* Funde con el detalle sólo en el borde: más arriba taparía lo que dice el flyer. */}
        <Fade from="calc(100% - 72px)" />
        <EventTopBar event={detail} signedIn={signedIn} isOrganizer={isOrganizer} isOpen={isOpen} />
      </div>

      <main className="relative mx-auto mt-4 flex max-w-xl flex-col gap-3 px-4">
        <div className="flex flex-wrap gap-2">
          {isToday && !cancelled && <Tag tone="accent">Hoy</Tag>}
          <Tag>{KIND_LABELS[event.kind] ?? "Encuentro"}</Tag>
          {price && <Tag>{price}</Tag>}
          {event.isSolidary && <Tag tone="accent">Solidario</Tag>}
          {cancelled && <Tag className="border-destructive text-destructive">Cancelado</Tag>}
          {ended && <Tag>Terminó</Tag>}
          {event.status === "hidden" && <Tag className="border-destructive text-destructive">Oculto por moderación</Tag>}
        </div>
        <h1 className={cn(text.display, "text-balance")}>{event.title}</h1>

        {/* "N van" con las fotos de los primeros anotados. Un invitado ve sólo el número. */}
        <Link
          href={signedIn ? `/e/${slug}/asistentes` : `/ingresar?next=${encodeURIComponent(`/e/${slug}`)}`}
          aria-disabled={signedIn ? faces.length === 0 : event.attendeeCount === 0}
          className="flex items-center gap-2 self-start outline-none aria-disabled:pointer-events-none active:opacity-70 focus-visible:underline"
        >
          {faces.length > 0 ? (
            <span className="relative h-7" style={{ width: 28 + (faces.length - 1) * 18 }}>
              {faces.map((person, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={person._id}
                  src={person.image ?? "/app/avatar.jpg"}
                  alt=""
                  className="absolute top-0 size-7 rounded-full border-2 border-background object-cover"
                  style={{ left: i * 18, zIndex: MAX_FACES - i }}
                />
              ))}
            </span>
          ) : (
            <Icon icon={UserGroupIcon} className="size-4 text-muted-foreground" />
          )}
          <span className={cn(text.label, "text-muted-foreground")}>
            {event.attendeeCount} van
            {!signedIn && event.attendeeCount > 0 ? " · Iniciá sesión para ver quiénes" : ""}
          </span>
          {signedIn && faces.length > 0 && <span className={cn(text.label, "text-brand-text")}>Ver todos</span>}
        </Link>

        {cancelled && (
          <p className={cn(text.body, "rounded-[12px] border border-destructive/40 bg-destructive/10 px-4 py-3")}>
            El organizador canceló este encuentro.
          </p>
        )}

        <Card className="mt-3 px-4">
          <Fact icon={Calendar03Icon} title={day} subtitle={hours} />
          <div className="h-px bg-border" />
          <Fact icon={Location01Icon} title={event.placeName} subtitle={event.placeName} />
          {price && (
            <>
              <div className="h-px bg-border" />
              <Fact icon={Ticket01Icon} title={`Entrada ${price}`} subtitle="Evento con entrada paga" />
            </>
          )}
          {event.isSolidary && (
            <>
              <div className="h-px bg-border" />
              <Fact icon={HandHeartIcon} title="Evento solidario" subtitle="Consultá con el organizador cómo colaborar" />
            </>
          )}
        </Card>

        <EventPlaceMap event={detail} mapsKey={process.env.GOOGLE_MAPS_API_KEY} />

        {event.description && <p className={cn(text.body, "mt-2 whitespace-pre-line text-muted-foreground")}>{event.description}</p>}

        {event.organizer && hasProfile ? (
          <Link
            href={`/organizador/${event.organizer._id}`}
            aria-label={`Ver perfil de ${organizerName}`}
            className="mt-3 flex items-center gap-3 border-t border-border pt-4 outline-none active:opacity-70 focus-visible:underline"
          >
            <Avatar name={organizerName} image={event.organizer.image} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className={cn(text.caption, "text-muted-foreground")}>Organiza</span>
              <span className={cn(text.heading, "truncate")}>{organizerName}</span>
            </span>
            <Icon icon={ArrowRight01Icon} className="size-[18px] text-muted-foreground" />
          </Link>
        ) : (
          <div className="mt-3 flex items-center gap-3 border-t border-border pt-4">
            <Avatar name={organizerName} image={event.organizer?.image ?? null} />
            <span className="flex flex-col">
              <span className={cn(text.caption, "text-muted-foreground")}>Organiza</span>
              <span className={text.heading}>{organizerName}</span>
            </span>
          </div>
        )}

        {android && (
          <a
            href={`gridd://event/${slug}`}
            className={cn(text.label, "mt-4 self-center rounded-full border border-border px-4 py-2 text-muted-foreground")}
          >
            Abrir en la app
          </a>
        )}
      </main>

      <EventActionBar
        event={detail}
        signedIn={signedIn}
        isOrganizer={isOrganizer}
        isOpen={isOpen}
        cancelled={cancelled}
        attending={attending}
        saved={saved}
      />
    </div>
  )
}

function Fact({ icon, title, subtitle }: { icon: IconSvgElement; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <Icon icon={icon} className="text-muted-foreground" />
      <div className="flex min-w-0 flex-col">
        <span className={text.heading}>{title}</span>
        <span className={cn(text.label, "text-muted-foreground")}>{subtitle}</span>
      </div>
    </div>
  )
}

/** Foto del organizador; sin foto, sus iniciales en flúor (como `orgBadge` en la app). */
function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className="size-11 shrink-0 rounded-full object-cover" />
  }
  const words = name.trim().split(/\s+/).filter(Boolean)
  const initials = (words.length > 1 ? words.slice(0, 3).map((w) => w[0]).join("") : name.slice(0, 2)).toUpperCase()
  return (
    <span className={cn(text.overline, "flex size-11 shrink-0 items-center justify-center rounded-full bg-raised text-brand-text")}>{initials}</span>
  )
}
