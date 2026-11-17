import type { Metadata } from "next"

import { EventForm } from "@/components/organizer/event-form"
import { requirePublisherPage } from "@/lib/guards"
import { requestTime } from "@/lib/event-time"

export const metadata: Metadata = { title: "Publicar evento", robots: { index: false } }

export default async function NuevoEventoPage() {
  await requirePublisherPage("/organizadores/panel/nuevo")
  return (
    // Pantalla completa, sin pestañas, como `publish` en la app (fullScreenModal).
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <EventForm now={requestTime()} mapsKey={process.env.GOOGLE_MAPS_API_KEY} />
      </main>
    </div>
  )
}
