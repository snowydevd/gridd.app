import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Cancel01Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PageHeader } from "@/components/page-header"
import { OrganizerRequestForm } from "@/components/profile/organizer-request-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getViewer, isPublisher, query, type PublisherRequest } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"

export const metadata: Metadata = { title: "Organizar encuentros", robots: { index: false } }

/**
 * Un usuario común pide permiso para publicar eventos; un admin lo aprueba desde el dashboard
 * (mobile/src/app/organizer-request.tsx).
 */
export default async function OrganizarPage() {
  const token = await pageToken("/perfil/organizar")
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl("/perfil/organizar"))
  // Ya puede publicar (por ejemplo, lo aprobaron mientras tenía la página abierta).
  if (isPublisher(viewer)) redirect("/organizadores/panel")

  const request = await query<PublisherRequest>("publisherRequests:mine", {}, token)

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-5 pt-8 pb-16 sm:px-8">
        <PageHeader eyebrow="Organizadores" title="Organizar encuentros" />

        {request?.status === "pending" ? (
          <Status icon={Clock01Icon} title="Tu solicitud está en revisión">
            Cuando la aprobemos vas a poder publicar eventos desde tu perfil.
          </Status>
        ) : (
          <>
            {request?.status === "rejected" && (
              <Status icon={Cancel01Icon} tone="danger" title="No aprobamos tu última solicitud">
                Podés mandar otra con más detalles sobre los encuentros que organizás.
              </Status>
            )}
            <p className="text-base leading-7 text-muted-foreground">
              Para publicar eventos en Gridd necesitamos saber quién sos. Contanos qué encuentros organizás, dónde,
              y dejanos un Instagram o grupo donde podamos verlos.
            </p>
            <OrganizerRequestForm />
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

function Status({
  icon,
  title,
  tone,
  children,
}: {
  icon: typeof Clock01Icon
  title: string
  tone?: "danger"
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5">
      <HugeiconsIcon
        icon={icon}
        strokeWidth={1.8}
        aria-hidden
        className={tone === "danger" ? "size-6 shrink-0 text-destructive" : "size-6 shrink-0 text-brand-text"}
      />
      <div className="flex flex-col gap-1">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">{children}</span>
      </div>
    </div>
  )
}
