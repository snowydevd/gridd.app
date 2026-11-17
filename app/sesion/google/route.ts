import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { action } from "@/lib/convex"
import { OAUTH_VERIFIER_COOKIE, safeNext, saveSession, type Tokens } from "@/lib/session"

/**
 * La vuelta de "Continuar con Google": Convex manda acá con `?code=`. Con el `verifier` guardado al
 * salir se cambian por la sesión (`auth:signIn` con `{ params: { code }, verifier }`, como el cliente
 * de Convex Auth) y se vuelve a `next`. Si algo falla, al login con el aviso.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const next = safeNext(params.get("next"), "/")
  const code = params.get("code")
  const store = await cookies()
  const verifier = store.get(OAUTH_VERIFIER_COOKIE)?.value
  store.delete(OAUTH_VERIFIER_COOKIE)

  let ok = false
  if (code && verifier) {
    try {
      const result = await action<{ tokens?: Tokens | null }>("auth:signIn", { params: { code }, verifier })
      if (result.tokens) {
        await saveSession(result.tokens)
        ok = true
      }
    } catch (error) {
      console.error("[auth] vuelta de google falló:", error)
    }
  }
  redirect(ok ? next : `/ingresar?error=google&next=${encodeURIComponent(next)}`)
}
