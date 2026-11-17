import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ScreenHeader } from "@/components/app/ui"
import { SignInForm } from "@/components/auth/sign-in-form"
import { getViewer } from "@/lib/convex"
import { pageMetadata } from "@/lib/seo"
import { pageToken, safeNext } from "@/lib/session"

export const metadata: Metadata = pageMetadata({
  title: "Entrar con email",
  description: "Entrá a tu cuenta de Gridd con tu email y contraseña.",
  path: "/ingresar/email",
  index: false,
})

/** Email y contraseña (mobile/src/app/email.tsx). `?modo=registro` abre en "Crear cuenta". */
export default async function IngresarEmailPage({ searchParams }: PageProps<"/ingresar/email">) {
  const params = await searchParams
  const next = safeNext(params.next, "/")
  const self = `/ingresar/email?next=${encodeURIComponent(next)}`
  if (await getViewer(await pageToken(self))) redirect(next)
  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader fallback={`/ingresar?next=${encodeURIComponent(next)}`} />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <SignInForm next={next} initialMode={params.modo === "registro" ? "signUp" : "signIn"} />
      </main>
    </div>
  )
}
