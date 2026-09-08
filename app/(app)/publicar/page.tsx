import type { Metadata } from "next"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/states/empty-state"

export const metadata: Metadata = { title: "Publicar · GRIDD" }

// Placeholder: el formulario de alta llega en GRI-13.
export default function PublicarPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Publicar"
        title="Nuevo evento"
        description="Fecha, lugar y poco más. Que llevarlo al alta sea rápido."
      />
      <EmptyState
        icon={PlusSignIcon}
        title="El formulario todavía no está"
        description="Por ahora sólo existe el lugar donde va a vivir."
      />
    </div>
  )
}
