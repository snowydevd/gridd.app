import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { SignInForm } from "@/components/auth/sign-in-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { pageMetadata } from "@/lib/seo"
import { getViewer } from "@/lib/convex"
import { pageToken, safeNext } from "@/lib/session"

export const metadata: Metadata = pageMetadata({
  title: "Ingresar",
  description: "Entrá a tu cuenta de Gridd para anotarte a encuentros y publicar los tuyos.",
  path: "/ingresar",
  index: false,
})

/** `?next=/ruta` vuelve ahí después de entrar; `?modo=registro` abre directo en "Crear cuenta". */
export default async function IngresarPage({ searchParams }: PageProps<"/ingresar">) {
  const params = await searchParams
  const next = safeNext(params.next, "/perfil")
  // Ya tiene una sesión válida: no tiene sentido el formulario. Se pregunta a Convex (y no sólo si hay
  // cookie) porque una cookie de una cuenta borrada mandaría a `next`, que volvería acá: un loop.
  const self = `/ingresar?next=${encodeURIComponent(next)}`
  if (await getViewer(await pageToken(self))) redirect(next)

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-10 pb-16">
        <SignInForm next={next} initialMode={params.modo === "registro" ? "signUp" : "signIn"} />
      </main>
      <SiteFooter />
    </div>
  )
}
