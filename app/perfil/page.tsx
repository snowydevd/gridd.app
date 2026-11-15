import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Add01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkBadge01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { signOut } from "@/app/ingresar/actions"
import { EventRow } from "@/components/events/event-row"
import { ProfileIdentity } from "@/components/profile/profile-identity"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getViewer, isPublisher, query, type GriddEvent, type PublisherRequest } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"
import { requestTime } from "@/lib/event-time"

export const metadata: Metadata = { title: "Mi perfil", robots: { index: false } }

const REQUEST_STATUS_LABELS = { pending: "Pendiente", approved: "Aprobada", rejected: "Rechazada" } as const

/** El perfil de la app (mobile/src/app/(tabs)/profile.tsx), en versión web. */
export default async function PerfilPage() {
  const token = await pageToken("/perfil")
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl("/perfil"))
  const publisher = isPublisher(viewer)

  const [attending, mine, request] = await Promise.all([
    query<GriddEvent[]>("attendance:myEvents", {}, token),
    publisher ? query<GriddEvent[]>("events:listMine", {}, token) : Promise.resolve([]),
    publisher ? Promise.resolve(null) : query<PublisherRequest>("publisherRequests:mine", {}, token),
  ])

  // Se renderiza en cada request: la hora del server es la del pedido.
  const now = requestTime()
  const upcoming = attending.filter((e) => e.endsAt >= now && e.status === "published")
  const stats = [
    // Encuentros que ya pasaron; uno cancelado no cuenta como ido.
    { value: attending.filter((e) => e.endsAt < now && e.status !== "cancelled").length, label: "Encuentros" },
    { value: mine.filter((e) => e.status === "published").length, label: "Organizados" },
    { value: upcoming.length, label: "Próximos" },
  ]
  const requestStatus = request && request.status !== "approved" ? REQUEST_STATUS_LABELS[request.status] : undefined

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-5 pt-10 pb-16 sm:px-8">
        <ProfileIdentity
          name={viewer.name}
          email={viewer.email}
          image={viewer.image}
          hasAvatar={viewer.hasAvatar}
          verified={publisher}
        />

        <dl className="grid grid-cols-3 divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center gap-0.5">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="font-heading text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <section className="flex flex-col gap-3">
          <h2 className="text-[0.72rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Vas a ir
          </h2>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-6 py-8 text-center">
              <p className="text-sm text-muted-foreground">Todavía no te anotaste a ningún encuentro.</p>
              <Link href="/eventos" className="text-sm font-medium text-brand hover:underline">
                Ver próximos encuentros →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {upcoming.map((event) => (
                <li key={event._id}>
                  <EventRow event={event} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <nav aria-label="Cuenta" className="divide-y divide-border rounded-3xl border border-border bg-card px-5">
          {publisher ? (
            <>
              <Row href="/organizadores/panel" icon={Calendar03Icon} label="Mis eventos" value={`${mine.length}`} />
              <Row href="/organizadores/panel/nuevo" icon={Add01Icon} label="Publicar evento" />
            </>
          ) : (
            <Row
              href="/perfil/organizar"
              icon={CheckmarkBadge01Icon}
              label="Quiero organizar encuentros"
              value={requestStatus}
            />
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="flex min-h-15 w-full items-center gap-4 text-left text-destructive outline-none focus-visible:underline"
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.8} aria-hidden className="size-5" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </form>
        </nav>
      </main>
      <SiteFooter />
    </div>
  )
}

function Row({
  href,
  icon,
  label,
  value,
}: {
  href: string
  icon: typeof Calendar03Icon
  label: string
  value?: string
}) {
  return (
    <Link
      href={href}
      className="flex min-h-15 items-center gap-4 outline-none hover:opacity-80 focus-visible:underline"
    >
      <HugeiconsIcon icon={icon} strokeWidth={1.8} aria-hidden className="size-5 text-muted-foreground" />
      <span className="flex-1 font-medium">{label}</span>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} aria-hidden className="size-4 text-muted-foreground" />
    </Link>
  )
}
