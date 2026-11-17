import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight01Icon,
  Car01Icon,
  CheckmarkBadge01Icon,
  Logout01Icon,
  Settings02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import { signOut } from "@/app/ingresar/actions"
import { RadiusRow } from "@/components/app/radius-row"
import { buttonClass, Card, Icon, rowClass, text } from "@/components/app/ui"
import { ProfileIdentity } from "@/components/profile/profile-identity"
import { carTitle, getViewer, isPublisher, query, type Car, type GriddEvent, type PublisherRequest } from "@/lib/convex"
import { requestTime } from "@/lib/event-time"
import { pageToken } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Mi perfil", robots: { index: false } }

const REQUEST_STATUS_LABELS = { pending: "Pendiente", approved: "Aprobada", rejected: "Rechazada" } as const

/** La pestaña Perfil (mobile/src/app/(tabs)/profile.tsx). Sin sesión, la invitación a entrar. */
export default async function PerfilPage() {
  const token = await pageToken("/perfil")
  const viewer = await getViewer(token)

  if (!token || !viewer) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-3 px-4 pt-[env(safe-area-inset-top)] text-center">
        <h1 className={text.title}>Estás como invitado</h1>
        <p className={cn(text.body, "text-muted-foreground")}>Creá una cuenta para anotarte a encuentros y publicar los tuyos.</p>
        <Link href="/ingresar?next=/perfil" className={buttonClass("primary", "mt-3 self-stretch")}>
          Iniciar sesión o registrarme
        </Link>
      </main>
    )
  }

  const publisher = isPublisher(viewer)
  const [attending, mine, saved, cars, request] = await Promise.all([
    query<GriddEvent[]>("attendance:myEvents", {}, token),
    publisher ? query<GriddEvent[]>("events:listMine", {}, token) : Promise.resolve([]),
    query<GriddEvent[]>("saves:mySaved", {}, token),
    query<Car[]>("cars:listMine", {}, token),
    publisher ? Promise.resolve(null) : query<PublisherRequest>("publisherRequests:mine", {}, token),
  ])

  // Se renderiza en cada request: la hora del server es la del pedido.
  const now = requestTime()
  const stats = [
    // Encuentros que ya pasaron; uno cancelado no cuenta como ido.
    { value: attending.filter((e) => e.endsAt < now && e.status !== "cancelled").length, label: "Encuentros" },
    { value: mine.filter((e) => e.status === "published").length, label: "Organizados" },
    { value: saved.length, label: "Guardados" },
  ]
  const requestStatus = request && request.status !== "approved" ? REQUEST_STATUS_LABELS[request.status] : undefined

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-8">
      <ProfileIdentity
        name={viewer.name}
        email={viewer.email}
        image={viewer.image}
        hasAvatar={viewer.hasAvatar}
        verified={publisher}
      />

      <dl className="flex">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("flex flex-1 flex-col-reverse items-center gap-0.5", i > 0 && "border-l border-border")}>
            <dt className={cn(text.caption, "text-muted-foreground")}>{s.label}</dt>
            <dd className={text.title}>{s.value}</dd>
          </div>
        ))}
      </dl>

      <Link href="/perfil/garage" className="rounded-[16px] outline-none active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60">
        <Card className="flex items-center gap-3 p-4">
          <span className="flex size-10 items-center justify-center rounded-[8px] bg-raised text-brand-text">
            <Icon icon={Car01Icon} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className={cn(text.heading, "truncate")}>{cars[0] ? carTitle(cars[0]) : "Agregá tu auto"}</span>
            <span className={cn(text.caption, "text-muted-foreground")}>
              {cars.length > 1 ? `Mi garage · ${cars.length} autos` : "Mi garage"}
            </span>
          </span>
          <Icon icon={ArrowRight01Icon} className="size-[18px] text-muted-foreground" />
        </Card>
      </Link>

      <Card className="px-4">
        <Row
          href="/perfil/intereses"
          icon={Tick02Icon}
          label="Intereses"
          value={viewer.interests.length > 0 ? `${viewer.interests.length}` : undefined}
        />
        {!publisher && (
          <Row href="/perfil/organizar" icon={CheckmarkBadge01Icon} label="Quiero organizar encuentros" value={requestStatus} />
        )}
        <Row href="/perfil/cuenta" icon={Settings02Icon} label="Cuenta" />
        <RadiusRow radius={viewer.searchRadius} />
        <form action={signOut}>
          <button type="submit" className={cn(rowClass, "text-destructive")}>
            <Icon icon={Logout01Icon} />
            <span className={cn(text.heading, "flex-1 text-base")}>Cerrar sesión</span>
          </button>
        </form>
      </Card>
    </main>
  )
}

function Row({ href, icon, label, value }: { href: string; icon: IconSvgElement; label: string; value?: string }) {
  return (
    <Link href={href} className={cn(rowClass, "border-b border-border")}>
      <Icon icon={icon} className="text-muted-foreground" />
      <span className={cn(text.heading, "flex-1 text-base")}>{label}</span>
      {value && <span className={cn(text.label, "text-muted-foreground")}>{value}</span>}
      <Icon icon={ArrowRight01Icon} className="size-[18px] text-muted-foreground" />
    </Link>
  )
}
