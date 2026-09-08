import type { Metadata } from "next"
import Link from "next/link"
import {
  Alert02Icon,
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

/** Vías de contacto. El asunto sugerido nos ordena la casilla. */
const channels: {
  icon: HugeIcon
  title: string
  subject: string
  body: string
  /** Se pinta en destructive: es la vía que no puede esperar. */
  urgent?: boolean
}[] = [
  {
    icon: Alert02Icon,
    title: "Reportar un evento",
    subject: "Reporte de evento",
    body: "Usá el botón de reporte en la ficha del evento: llega con el link y el motivo ya cargados. Si no podés, escribinos con el link.",
    urgent: true,
  },
  {
    icon: Delete02Icon,
    title: "Baja de cuenta o de un evento",
    subject: "Baja de cuenta",
    body: "Escribinos desde el mail de la cuenta. Borramos cuenta y eventos dentro de los 10 días hábiles y te confirmamos cuando está hecho.",
  },
  {
    icon: MessageQuestionIcon,
    title: "Reclamo por moderación",
    subject: "Reclamo por moderación",
    body: "Si bajamos un evento tuyo y creés que fue un error, contanos cuál era y por qué. Lo revisa una persona.",
  },
  {
    icon: Mail01Icon,
    title: "Cualquier otra cosa",
    subject: "Consulta",
    body: "Prensa, organizadores, predios, o simplemente algo que no anda.",
  },
]

export default function ContactoPage() {
  return (
    <LegalShell
      title="Contacto y bajas"
      description={
        <>
          Todo entra por la misma casilla:{" "}
          <a
            href={`mailto:${site.contactEmail}`}
            className="text-foreground underline underline-offset-4 hover:text-brand"
          >
            {site.contactEmail}
          </a>
          . El asunto nos ayuda a ordenarla.
        </>
      }
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
                href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(
                  `[${channel.subject}] `
                )}`}
                className="font-mono text-xs tracking-[0.04em] text-foreground underline underline-offset-4 hover:text-brand"
              >
                Asunto: [{channel.subject}]
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
