import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { EventForm } from "@/components/organizer/event-form"
import { getEventAs } from "@/lib/convex"
import { requirePublisherPage } from "@/lib/guards"
import { requestTime } from "@/lib/event-time"

export const metadata: Metadata = { title: "Editar evento", robots: { index: false } }

export default async function EditarEventoPage({ params }: PageProps<"/organizadores/panel/[slug]/editar">) {
  const { slug } = await params
  const { token, viewer } = await requirePublisherPage(`/organizadores/panel/${slug}/editar`)
  const event = await getEventAs(slug, token)
  if (!event) notFound()
  // El backend sólo deja editar eventos propios y publicados: lo demás vuelve a la ficha.
  if (event.organizer?._id !== viewer._id || event.status !== "published") redirect(`/e/${slug}`)

  return (
    // Pantalla completa, sin pestañas, como `publish` en la app (fullScreenModal).
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <EventForm initial={event} now={requestTime()} mapsKey={process.env.GOOGLE_MAPS_API_KEY} />
      </main>
    </div>
  )
}
