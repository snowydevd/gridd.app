import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ReportForm } from "@/components/app/report-form"
import { ScreenHeader } from "@/components/app/ui"
import { getViewer } from "@/lib/convex"
import { loginUrl, pageToken, safeNext } from "@/lib/session"

export const metadata: Metadata = { title: "Reportar", robots: { index: false } }

/**
 * Reportar un evento (`?evento=<id>`) o a un usuario (`?usuario=<id>`), como mobile/src/app/report.tsx.
 * `titulo` es lo que se muestra de él y `volver`, a dónde ir después.
 */
export default async function ReportarPage({ searchParams }: PageProps<"/reportar">) {
  const params = await searchParams
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined)
  const eventId = str(params.evento)
  const userId = str(params.usuario)
  const back = safeNext(str(params.volver), "/")
  const self = `/reportar?${new URLSearchParams(Object.entries(params).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])))}`

  const token = await pageToken(self)
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl(self))
  if (!eventId && !userId) redirect(back)

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Reportar" icon="close" fallback={back} />
      <ReportForm
        target={userId ? { kind: "user", id: userId } : { kind: "event", id: eventId! }}
        title={str(params.titulo)?.slice(0, 120)}
        back={back}
      />
    </div>
  )
}
