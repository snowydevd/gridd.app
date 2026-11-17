import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { InterestsForm } from "@/components/app/interests-form"
import { ScreenHeader } from "@/components/app/ui"
import { getViewer } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"

export const metadata: Metadata = { title: "Tus intereses", robots: { index: false } }

export default async function InteresesPage() {
  const token = await pageToken("/perfil/intereses")
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl("/perfil/intereses"))
  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Tus intereses" fallback="/perfil" />
      <InterestsForm initial={viewer.interests} />
    </div>
  )
}
