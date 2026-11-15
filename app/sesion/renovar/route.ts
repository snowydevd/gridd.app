import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { clearSession, getRefreshToken, renewTokens, safeNext, saveSession } from "@/lib/session"

/**
 * Renueva la sesión y vuelve a la página que la pidió (ver `pageToken`). Es un Route Handler porque
 * las páginas no pueden escribir cookies. Si no se puede renovar, cierra la sesión: así la página no
 * vuelve a mandar acá y no hay loop.
 */
export async function GET(request: NextRequest) {
  const next = safeNext(request.nextUrl.searchParams.get("next"), "/")
  const refreshToken = await getRefreshToken()
  let renewed = false
  if (refreshToken) {
    try {
      const tokens = await renewTokens(refreshToken)
      if (tokens) {
        await saveSession(tokens)
        renewed = true
      }
    } catch (error) {
      console.error("[session] renovar falló:", error)
    }
  }
  if (!renewed) await clearSession()
  redirect(next)
}
