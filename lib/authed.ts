import { ConvexCallError } from "@/lib/convex"
import { actionToken } from "@/lib/session"

/**
 * Resultado de una server action con sesión. `reason: "auth"` = no hay sesión (o venció): el cliente
 * manda a `/ingresar`. El resto de los errores trae un mensaje para mostrar.
 */
export type ActionResult<T = null> =
  | { ok: true; value: T }
  | { ok: false; reason: "auth" }
  | { ok: false; reason: "error"; message: string }

/**
 * Corre `fn` con el token de la sesión (renovándolo si hace falta). El token se lee acá, nunca llega
 * del cliente, y la identidad viaja sólo en él: ninguna action manda un userId.
 */
export async function withSession<T>(
  label: string,
  fallback: string,
  fn: (token: string) => Promise<T>
): Promise<ActionResult<T>> {
  const token = await actionToken()
  if (!token) return { ok: false, reason: "auth" }
  try {
    return { ok: true, value: await fn(token) }
  } catch (error) {
    if (error instanceof ConvexCallError) {
      if (error.data?.code === "UNAUTHENTICATED") return { ok: false, reason: "auth" }
      // Los errores de `fail()` (mobile/convex/lib/errors.ts) traen el mensaje en español.
      if (error.data?.message) return { ok: false, reason: "error", message: error.data.message }
    }
    console.error(`[${label}] falló:`, error)
    return { ok: false, reason: "error", message: fallback }
  }
}
