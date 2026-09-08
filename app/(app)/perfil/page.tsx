import type { Metadata } from "next"
import { User03Icon } from "@hugeicons/core-free-icons"

import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/states/empty-state"

export const metadata: Metadata = { title: "Perfil · GRIDD" }

// Placeholder: perfil y auth llegan en GRI-11 y GRI-12.
export default function PerfilPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Cuenta" title="Perfil" />
      <EmptyState
        icon={User03Icon}
        title="Todavía no hay sesión"
        description="Cuando exista el login vas a poder ver y editar tus eventos desde acá."
      />
    </div>
  )
}
