import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons"

import { EventRow } from "@/components/app/event-cards"
import { OrganizerActions, OrganizerMore } from "@/components/app/organizer-actions"
import { Icon, ScreenHeader, text } from "@/components/app/ui"
import { ConvexCallError, getViewer, query, type OrganizerProfile } from "@/lib/convex"
import { requestTime } from "@/lib/event-time"
import { pageToken } from "@/lib/session"
import { cn } from "@/lib/utils"

async function getProfile(id: string, token?: string) {
  try {
    return await query<OrganizerProfile | null>("organizers:get", { userId: id }, token)
  } catch (error) {
    // Un id con forma inválida es lo mismo que uno que no existe.
    if (error instanceof ConvexCallError) return null
    throw error
  }
}

export async function generateMetadata({ params }: PageProps<"/organizador/[id]">): Promise<Metadata> {
  const { id } = await params
  const profile = await getProfile(id)
  if (!profile) return { title: "Organizador no encontrado", robots: { index: false } }
  const name = profile.name ?? "Organizador"
  return {
    title: name,
    description: `Los encuentros que organiza ${name} en Gridd.`,
    alternates: { canonical: `/organizador/${id}` },
  }
}

/** Perfil público de un organizador (mobile/src/app/organizer/[id].tsx): seguir, próximos y anteriores. */
export default async function OrganizadorPage({ params }: PageProps<"/organizador/[id]">) {
  const { id } = await params
  const token = await pageToken(`/organizador/${id}`)
  const [profile, viewer] = await Promise.all([getProfile(id, token), getViewer(token)])
  if (!profile) notFound()

  const name = profile.name ?? "Organizador"
  const isMe = viewer?._id === profile._id
  const published = profile.upcoming.length + profile.past.length
  const now = requestTime()
  const stats = [
    { value: profile.followerCount, label: profile.followerCount === 1 ? "Seguidor" : "Seguidores" },
    { value: published, label: published === 1 ? "Evento" : "Eventos" },
  ]

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader
        fallback="/"
        action={<OrganizerMore id={profile._id} name={name} upcoming={profile.upcoming.length} isMe={isMe} signedIn={!!viewer} />}
      />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.image ?? "/app/avatar.jpg"} alt="" className="size-24 rounded-full border-2 border-border object-cover" />
          <div className="flex items-center gap-1.5">
            <h1 className={text.title}>{name}</h1>
            {profile.verified && <Icon icon={CheckmarkBadge01Icon} className="size-[18px] text-brand-text" />}
          </div>
        </div>

        <dl className="flex">
          {stats.map((s, i) => (
            <div key={s.label} className={cn("flex flex-1 flex-col-reverse items-center gap-0.5", i > 0 && "border-l border-border")}>
              <dt className={cn(text.caption, "text-muted-foreground")}>{s.label}</dt>
              <dd className={text.title}>{s.value}</dd>
            </div>
          ))}
        </dl>

        {!isMe && <OrganizerActions id={profile._id} following={profile.isFollowing} signedIn={!!viewer} />}

        {published === 0 ? (
          <p className={cn(text.body, "text-center text-muted-foreground")}>Todavía no publicó eventos.</p>
        ) : (
          [
            { label: "Próximos", events: profile.upcoming, dimmed: false },
            { label: "Anteriores", events: profile.past, dimmed: true },
          ].map(
            (section) =>
              section.events.length > 0 && (
                <section key={section.label} className="flex flex-col gap-1">
                  <h2 className={cn(text.overline, "text-muted-foreground")}>{section.label}</h2>
                  {section.events.map((e) => (
                    <EventRow key={e._id} event={e} now={now} dimmed={section.dimmed} />
                  ))}
                </section>
              )
          )
        )}
      </main>
    </div>
  )
}
