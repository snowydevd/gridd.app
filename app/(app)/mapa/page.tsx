import type { Metadata } from "next"
import { MapsIcon } from "@hugeicons/core-free-icons"

import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/states/empty-state"

export const metadata: Metadata = { title: "Mapa · GRIDD" }

// Placeholder: el mapa con filtros llega en GRI-17.
export default function MapaPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Descubrir"
        title="Mapa"
        description="Los eventos cerca tuyo, sobre el mapa."
      />
      <EmptyState
        icon={MapsIcon}
        title="El mapa todavía no está"
        description="Falta conectar los datos geoespaciales."
      />
    </div>
  )
}
