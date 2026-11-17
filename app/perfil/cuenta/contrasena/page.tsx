import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ScreenHeader } from "@/components/app/ui"
import { SignInForm } from "@/components/auth/sign-in-form"
import { getViewer } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"

export const metadata: Metadata = { title: "Cambiar contraseña", robots: { index: false } }

/** Cambiar contraseña (en la app, `/email?mode=change`): código al mail de la cuenta y la nueva. */
export default async function ContrasenaPage() {
  const token = await pageToken("/perfil/cuenta/contrasena")
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl("/perfil/cuenta/contrasena"))
  if (!viewer.hasPassword || !viewer.email) redirect("/perfil/cuenta")
  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader fallback="/perfil/cuenta" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <SignInForm next="/perfil/cuenta" changeEmail={viewer.email} />
      </main>
    </div>
  )
}
