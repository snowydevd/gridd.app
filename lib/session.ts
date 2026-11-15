import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { action, ConvexCallError } from "@/lib/convex"

/**
 * Sesión de Convex Auth en dos cookies httpOnly, como la app guarda las dos claves en SecureStore:
 * el JWT (dura 1 hora) y el refresh token (la sesión vence a los 30 días sin uso).
 * El token nunca llega al navegador: lo leen las páginas y las server actions.
 */
const TOKEN_COOKIE = "GRIDD_SESSION_JWT"
const REFRESH_COOKIE = "GRIDD_SESSION_REFRESH"
/** Lo mismo que `DEFAULT_SESSION_INACTIVE_DURATION_MS` de Convex Auth. */
const SESSION_MAX_AGE = 60 * 60 * 24 * 30
/** Un token que vence en menos de esto ya se renueva: no vale la pena mandarlo a Convex. */
const EXPIRY_MARGIN_MS = 60 * 1000

export type Tokens = { token: string; refreshToken: string }

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE,
} as const

export async function saveSession({ token, refreshToken }: Tokens) {
  const store = await cookies()
  store.set(TOKEN_COOKIE, token, cookieOptions)
  store.set(REFRESH_COOKIE, refreshToken, cookieOptions)
}

export async function clearSession() {
  const store = await cookies()
  store.delete(TOKEN_COOKIE)
  store.delete(REFRESH_COOKIE)
}

/** `true` si el JWT no venció (sin verificar la firma: eso lo hace Convex al recibirlo). */
function isFresh(jwt: string) {
  try {
    const payload = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const { exp } = JSON.parse(atob(payload)) as { exp?: number }
    return typeof exp === "number" && exp * 1000 - EXPIRY_MARGIN_MS > Date.now()
  } catch {
    return false
  }
}

/** El token vigente, o `undefined`. No renueva: sirve para las server actions que no lo necesitan sí o sí. */
export async function getToken(): Promise<string | undefined> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value
  return token && isFresh(token) ? token : undefined
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value
}

/**
 * Pide tokens nuevos con el refresh token (`auth:signIn` con `{ refreshToken }`, como el cliente de
 * Convex Auth). `null` si la sesión ya no vale; tira si falló la red, para no cerrarla por eso.
 */
export async function renewTokens(refreshToken: string): Promise<Tokens | null> {
  try {
    const result = await action<{ tokens?: Tokens | null }>("auth:signIn", { refreshToken })
    return result.tokens ?? null
  } catch (error) {
    if (error instanceof ConvexCallError) return null
    throw error
  }
}

/**
 * Token para una página (Server Component). Las páginas no pueden escribir cookies, así que si el JWT
 * venció y hay refresh token, se pasa por `/sesion/renovar`, que lo renueva y vuelve a `path`.
 */
export async function pageToken(path: string): Promise<string | undefined> {
  const store = await cookies()
  const token = store.get(TOKEN_COOKIE)?.value
  if (token && isFresh(token)) return token
  if (store.get(REFRESH_COOKIE)?.value) redirect(`/sesion/renovar?next=${encodeURIComponent(path)}`)
  return undefined
}

/** Token para una server action: si venció, lo renueva ahí mismo (las actions sí escriben cookies). */
export async function actionToken(): Promise<string | undefined> {
  const store = await cookies()
  const token = store.get(TOKEN_COOKIE)?.value
  if (token && isFresh(token)) return token
  const refreshToken = store.get(REFRESH_COOKIE)?.value
  if (!refreshToken) return undefined
  try {
    const tokens = await renewTokens(refreshToken)
    if (!tokens) {
      await clearSession()
      return undefined
    }
    await saveSession(tokens)
    return tokens.token
  } catch (error) {
    console.error("[session] renovar falló:", error)
    return undefined
  }
}

/** Sólo rutas internas: `/perfil` sí, `//otro.com` o `https://…` no (evita un open redirect). */
export function safeNext(next: unknown, fallback = "/eventos"): string {
  // Sin caracteres de control ni barras invertidas: el navegador los "arregla" y `/\\otro.com` termina afuera.
  if (typeof next !== "string" || !next.startsWith("/") || /[\u0000-\u001f\\]/.test(next)) return fallback
  // Se resuelve contra un origen de mentira: si el resultado sale de ese origen, era un link externo.
  const base = "https://gridd.invalid"
  const url = new URL(next, base)
  const path = url.pathname + url.search + url.hash
  // `/..//otro.com` se normaliza a `//otro.com`: también se descarta.
  return url.origin === base && !path.startsWith("//") ? path : fallback
}

/** A dónde mandar a alguien sin sesión, para que vuelva a `path` después de entrar. */
export const loginUrl = (path: string) => `/ingresar?next=${encodeURIComponent(path)}`
