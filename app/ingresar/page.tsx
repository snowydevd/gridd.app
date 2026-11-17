import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { LoginScreen } from "@/components/app/login-screen"
import { getViewer } from "@/lib/convex"
import { pageMetadata } from "@/lib/seo"
import { pageToken, safeNext } from "@/lib/session"

export const metadata: Metadata = pageMetadata({
  title: "Ingresar",
  description: "Entrá a tu cuenta de Gridd para anotarte a encuentros y publicar los tuyos.",
  path: "/ingresar",
  index: false,
})

/** El login de la app (mobile/src/app/login.tsx). `?next=/ruta` vuelve ahí después de entrar. */
export default async function IngresarPage({ searchParams }: PageProps<"/ingresar">) {
  const params = await searchParams
  const next = safeNext(params.next, "/")
  // Los links viejos a "Crear cuenta" van directo al formulario.
  if (params.modo === "registro") redirect(`/ingresar/email?modo=registro&next=${encodeURIComponent(next)}`)
  // Ya tiene una sesión válida: no tiene sentido el login. Se pregunta a Convex (y no sólo si hay
  // cookie) porque una cookie de una cuenta borrada mandaría a `next`, que volvería acá: un loop.
  const self = `/ingresar?next=${encodeURIComponent(next)}`
  if (await getViewer(await pageToken(self))) redirect(next)

  return <LoginScreen next={next} googleFailed={params.error === "google"} />
}
