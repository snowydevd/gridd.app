import type { Metadata } from "next"
import Link from "next/link"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/states/empty-state"
import { Button } from "@/components/ui/button"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Eventos",
  description:
    "Todos los encuentros fierreros que se vienen, ordenados por fecha: junadas, rodadas, expos y fechas de pista.",
  path: "/eventos",
})

// Placeholder: el listado real llega en GRI-18 (Vista lista de eventos).
export default function EventosPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Descubrir"
        title="Eventos"
        description="Lo que se viene, ordenado por fecha."
      />
      <EmptyState
        icon={Calendar03Icon}
        title="Todavía no hay eventos"
        description="Cuando alguien publique algo cerca tuyo, va a aparecer acá."
        action={
          <Button
            variant="brand"
            nativeButton={false}
            render={<Link href="/publicar">Publicar el primero</Link>}
          />
        }
      />
    </div>
  )
}
