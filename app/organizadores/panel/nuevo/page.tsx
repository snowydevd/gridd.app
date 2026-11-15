import type { Metadata } from "next"

import { EventForm } from "@/components/organizer/event-form"
import { SiteHeader } from "@/components/site-header"
import { requirePublisherPage } from "@/lib/guards"
import { requestTime } from "@/lib/event-time"

export const metadata: Metadata = { title: "Publicar evento", robots: { index: false } }

export default async function NuevoEventoPage() {
  await requirePublisherPage("/organizadores/panel/nuevo")
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pt-8 pb-16 sm:px-8">
        <EventForm now={requestTime()} mapsKey={process.env.GOOGLE_MAPS_API_KEY} />
      </main>
    </div>
  )
}
