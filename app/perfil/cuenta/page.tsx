import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  File01Icon,
  HelpCircleIcon,
  LinkSquare02Icon,
  LockIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import { AppearanceRow, DeleteAccountRow, ReportProblemRow } from "@/components/app/account-rows"
import { Card, Icon, rowClass, ScreenHeader, text } from "@/components/app/ui"
import { getViewer, isPublisher } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Cuenta", robots: { index: false } }

/** Cuenta (mobile/src/app/account-details.tsx): apariencia, contraseña, ayuda, legales y eliminar cuenta. */
export default async function CuentaPage() {
  const token = await pageToken("/perfil/cuenta")
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl("/perfil/cuenta"))

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Cuenta" fallback="/perfil" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <p className={text.title}>{viewer.name ?? "Sin nombre"}</p>
            {isPublisher(viewer) && <Icon icon={CheckmarkBadge01Icon} className="size-[18px] text-brand-text" />}
          </div>
          {viewer.email && <p className={cn(text.label, "text-muted-foreground")}>{viewer.email}</p>}
        </div>

        <Section title="Preferencias">
          <AppearanceRow />
        </Section>

        {viewer.hasPassword && viewer.email && (
          <Section title="Seguridad">
            <Row href="/perfil/cuenta/contrasena" icon={LockIcon} label="Cambiar contraseña" last />
          </Section>
        )}

        <Section title="Ayuda">
          <Row href="/contacto" icon={HelpCircleIcon} label="Contacto" external />
          <ReportProblemRow />
        </Section>

        <Section title="Legal">
          <Row href="/terminos" icon={File01Icon} label="Términos y condiciones" external />
          <Row href="/privacidad" icon={LockIcon} label="Privacidad" external />
          <Row href="/normas" icon={SecurityCheckIcon} label="Normas de la comunidad" external last />
        </Section>

        <div className="mt-auto px-4">
          <DeleteAccountRow />
          <p className={cn(text.caption, "mt-2 text-center text-muted-foreground")}>Gridd web</p>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className={cn(text.overline, "text-muted-foreground")}>{title}</h2>
      <Card className="px-4">{children}</Card>
    </section>
  )
}

function Row({ href, icon, label, external, last }: { href: string; icon: IconSvgElement; label: string; external?: boolean; last?: boolean }) {
  return (
    <Link href={href} className={cn(rowClass, "min-h-14", !last && "border-b border-border")}>
      <Icon icon={icon} className="text-muted-foreground" />
      <span className={cn(text.heading, "flex-1 text-base")}>{label}</span>
      <Icon icon={external ? LinkSquare02Icon : ArrowRight01Icon} className="size-[18px] text-muted-foreground" />
    </Link>
  )
}
