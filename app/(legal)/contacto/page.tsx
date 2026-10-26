import type { Metadata } from "next"
import Link from "next/link"
import {
  Alert02Icon,
  Calendar03Icon,
  CustomerSupportIcon,
  Delete02Icon,
  Mail01Icon,
  MessageQuestionIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { LegalShell } from "@/components/legal/legal-shell"
import { Prose } from "@/components/legal/prose"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Contacto y bajas",
  description:
    "Cómo pedir la baja de una cuenta o de un evento, reclamar por una decisión de moderación o reportar algo urgente.",
  path: "/contacto",
})

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"]

/** Vías de contacto. Cada una va a su casilla; el asunto sugerido ordena dentro de ella. */
const channels: {
  icon: HugeIcon
  title: string
  email: string
  subject: string
  body: string
  /** Se pinta en destructive: es la vía que no puede esperar. */
  urgent?: boolean
}[] = [
  {
    icon: Alert02Icon,
    title: "Reportar un evento",
    email: site.emails.moderacion,
    subject: "Reporte de evento",
    body: "Usá el botón de reporte en la ficha del evento: llega con el link y el motivo ya cargados. Si no podés, escribinos con el link.",
    urgent: true,
  },
  {
    icon: MessageQuestionIcon,
    title: "Reclamo por moderación",
    email: site.emails.moderacion,
    subject: "Reclamo por moderación",
    body: "Si bajamos un evento tuyo y creés que fue un error, contanos cuál era y por qué. Lo revisa una persona.",
  },
  {
    icon: Delete02Icon,
    title: "Baja de cuenta o de un evento",
    email: site.emails.soporte,
    subject: "Baja de cuenta",
    body: "Escribinos desde el mail de la cuenta. Borramos cuenta y eventos dentro de los 10 días hábiles y te confirmamos cuando está hecho.",
  },
  {
    icon: CustomerSupportIcon,
    title: "Dudas o algo que no anda",
    email: site.emails.soporte,
    subject: "Consulta",
    body: "Cómo se usa algo, un error en la app o una cuenta que no te deja entrar.",
  },
  {
    icon: Calendar03Icon,
    title: "Organizadores",
    email: site.emails.organizadores,
    subject: "Organizador",
    body: "Clubes, predios y quienes organizan meets: publicar eventos, alianzas o cualquier cosa del lado de la organización.",
  },
  {
    icon: Mail01Icon,
    title: "Prensa y todo lo demás",
    email: site.emails.hola,
    subject: "Consulta",
    body: "Prensa, propuestas o lo que no entre en las otras.",
  },
]

export default function ContactoPage() {
  return (
    <LegalShell
      title="Contacto y bajas"
      description="Cada tema tiene su casilla. Escribí a la que corresponda y usá el asunto sugerido: nos ayuda a responder más rápido."
      updated={false}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {channels.map((channel) => (
          <Card key={channel.title} size="sm" className="gap-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={channel.icon}
                  strokeWidth={2}
                  aria-hidden
                  className={
                    channel.urgent
                      ? "size-4 text-destructive"
                      : "size-4 text-muted-foreground"
                  }
                />
                {channel.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm leading-6 text-muted-foreground">
                {channel.body}
              </p>
              <a
                href={`mailto:${channel.email}?subject=${encodeURIComponent(
                  `[${channel.subject}] `
                )}`}
                className="flex flex-col gap-1 font-mono text-xs tracking-[0.04em] text-foreground underline underline-offset-4 hover:text-brand"
              >
                <span>{channel.email}</span>
                <span className="text-muted-foreground">
                  Asunto: [{channel.subject}]
                </span>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Prose>
        <h2>Antes de escribir por una baja</h2>
        <ul>
          <li>
            Si sólo querés bajar <strong>un evento</strong>, podés borrarlo vos
            desde tu perfil. Es inmediato.
          </li>
          <li>
            Si querés borrar <strong>la cuenta entera</strong>, escribinos desde
            el mail asociado. Se van también todos tus eventos.
          </li>
          <li>
            Los respaldos técnicos se pisan solos a los 30 días. El detalle está
            en la <Link href="/privacidad">política de privacidad</Link>.
          </li>
          <li>
            Para pedir una copia de tus datos, corregirlos u oponerte a que los
            usemos, escribí a{" "}
            <a href={`mailto:${site.emails.privacidad}`}>
              {site.emails.privacidad}
            </a>{" "}
            desde el mail de tu cuenta.
          </li>
        </ul>

        <h2>Si es urgente</h2>
        <p>
          Si lo que estás viendo pone gente en riesgo ahora, no esperes a que
          contestemos un mail: llamá al 911. Después mandanos el link del evento
          y lo bajamos.
        </p>
      </Prose>
    </LegalShell>
  )
}
