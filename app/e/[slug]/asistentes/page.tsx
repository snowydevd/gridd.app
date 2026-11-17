import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { ScreenHeader, text } from "@/components/app/ui"
import { attendeeCar, ConvexCallError, getEventAs, getViewer, query, type Attendee } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Quiénes van", robots: { index: false } }

/** Lista completa de quiénes van (mobile/src/app/attendees/[id].tsx). Sólo con sesión, como exige el backend. */
export default async function AsistentesPage({ params }: PageProps<"/e/[slug]/asistentes">) {
  const { slug } = await params
  const path = `/e/${slug}/asistentes`
  const token = await pageToken(path)
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl(path))
  const event = await getEventAs(slug, token)
  if (!event) notFound()

  let attendees: Attendee[]
  try {
    attendees = await query<Attendee[]>("attendance:list", { eventId: event._id }, token)
  } catch (error) {
    if (error instanceof ConvexCallError) notFound()
    throw error
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title={`Van ${attendees.length}`} fallback={`/e/${slug}`} />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        {attendees.length === 0 ? (
          <p className={cn(text.body, "mt-8 text-center text-muted-foreground")}>Todavía no se anotó nadie.</p>
        ) : (
          <ul>
            {attendees.map((person) => (
              <li key={person._id} className="flex items-center gap-3 border-b border-border py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={person.image ?? "/app/avatar.jpg"} alt="" className="size-11 rounded-full object-cover" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className={cn(text.heading, "truncate")}>{person.name ?? "Sin nombre"}</span>
                  {person.car && <span className={cn(text.caption, "truncate text-muted-foreground")}>{attendeeCar(person.car)}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
