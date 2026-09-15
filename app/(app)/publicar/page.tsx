import type { Metadata } from "next"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { PicadasNotice } from "@/components/legal/picadas-notice"
import { TermsAcceptance } from "@/components/legal/terms-acceptance"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/states/empty-state"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Publicar",
  description:
    "Publicá tu evento en Gridd: fecha, lugar y poco más. Nada de picadas ni carreras en la vía pública.",
  path: "/publicar",
  ogTitle: "Publicar un evento · GRIDD",
})

// Placeholder: el formulario de alta llega en GRI-13. El aviso de picadas y la
// aceptación de términos ya viven acá (GRI-25) para que el form los herede.
export default function PublicarPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Publicar"
        title="Nuevo evento"
        description="Fecha, lugar y poco más. Que llevarlo al alta sea rápido."
      />
      <PicadasNotice />
      <EmptyState
        icon={PlusSignIcon}
        title="El formulario todavía no está"
        description="Por ahora sólo existe el lugar donde va a vivir."
      />
      <TermsAcceptance className="max-w-prose" />
    </div>
  )
}
