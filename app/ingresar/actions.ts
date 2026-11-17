"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { authErrorMessage, validateCredentials, type PasswordFlow } from "@/lib/auth-errors"
import { action, ConvexCallError } from "@/lib/convex"
import { clearSession, getToken, OAUTH_VERIFIER_COOKIE, safeNext, saveSession, type Tokens } from "@/lib/session"

export type AuthResult = { ok: true } | { ok: false; message: string }

/**
 * Llama a `auth:signIn` con el provider `password` (mobile/convex/auth.ts) y, si devuelve tokens,
 * los guarda en las cookies. El token nunca vuelve al cliente.
 */
async function passwordSignIn(flow: PasswordFlow, params: Record<string, string>): Promise<AuthResult> {
  try {
    const result = await action<{ tokens?: Tokens | null; started?: boolean }>("auth:signIn", {
      provider: "password",
      params: { ...params, flow },
    })
    // `reset` sólo manda el mail: no hay sesión todavía.
    if (flow === "reset") return { ok: true }
    if (!result.tokens) return { ok: false, message: authErrorMessage("", flow) }
    await saveSession(result.tokens)
    return { ok: true }
  } catch (error) {
    // Los errores de `fail()` (validación) traen el mensaje listo; los de Convex Auth, un texto en inglés.
    if (error instanceof ConvexCallError) {
      if (error.data?.message) return { ok: false, message: error.data.message }
      return { ok: false, message: authErrorMessage(error.message, flow) }
    }
    console.error(`[auth] ${flow} falló:`, error)
    return { ok: false, message: "No pudimos conectarnos. Probá de nuevo en un rato." }
  }
}

const isText = (...values: unknown[]) => values.every((v) => typeof v === "string")

export async function signIn(input: { email: string; password: string }): Promise<AuthResult> {
  if (!isText(input?.email, input?.password) || !input.password) {
    return { ok: false, message: "Faltan datos. Revisá el formulario." }
  }
  const invalid = validateCredentials("signIn", input)
  if (invalid) return { ok: false, message: invalid }
  return passwordSignIn("signIn", { email: input.email.trim(), password: input.password })
}

export async function signUp(input: { name: string; email: string; password: string }): Promise<AuthResult> {
  if (!isText(input?.name, input?.email, input?.password)) {
    return { ok: false, message: "Faltan datos. Revisá el formulario." }
  }
  const invalid = validateCredentials("signUp", input)
  if (invalid) return { ok: false, message: invalid }
  return passwordSignIn("signUp", { name: input.name.trim(), email: input.email.trim(), password: input.password })
}

/** Manda el código de 8 dígitos para cambiar la contraseña. */
export async function sendResetCode(input: { email: string }): Promise<AuthResult> {
  if (!isText(input?.email)) return { ok: false, message: "Faltan datos. Revisá el formulario." }
  const invalid = validateCredentials("reset", input)
  if (invalid) return { ok: false, message: invalid }
  return passwordSignIn("reset", { email: input.email.trim() })
}

/** Cambia la contraseña con el código y deja la sesión abierta. */
export async function resetPassword(input: { email: string; code: string; password: string }): Promise<AuthResult> {
  if (!isText(input?.email, input?.code, input?.password)) {
    return { ok: false, message: "Faltan datos. Revisá el formulario." }
  }
  const invalid = validateCredentials("reset-verification", input)
  if (invalid) return { ok: false, message: invalid }
  return passwordSignIn("reset-verification", {
    email: input.email.trim(),
    code: input.code.trim(),
    newPassword: input.password,
  })
}

/** Cierra la sesión en Convex (invalida el refresh token) y borra las cookies. */
export async function signOut() {
  const token = await getToken()
  if (token) {
    try {
      await action("auth:signOut", {}, token)
    } catch (error) {
      // Igual se borran las cookies: en este navegador la sesión se cierra.
      console.error("[auth] signOut falló:", error)
    }
  }
  await clearSession()
  redirect("/")
}

/**
 * "Continuar con Google": arranca el OAuth de Convex Auth (`auth:signIn` con el provider `google`) y
 * devuelve la URL a la que tiene que ir el navegador. Google vuelve a Convex y Convex a
 * `/sesion/google`, que termina de entrar. `SITE_URL` del deployment tiene que ser este sitio.
 */
export async function startGoogleSignIn(input: { next: string }): Promise<AuthResult & { url?: string }> {
  const next = safeNext(input?.next, "/")
  try {
    const result = await action<{ redirect?: string; verifier?: string }>("auth:signIn", {
      provider: "google",
      params: { redirectTo: `/sesion/google?next=${encodeURIComponent(next)}` },
    })
    if (!result.redirect || !result.verifier) return { ok: false, message: "No pudimos conectar con Google. Probá de nuevo en un rato." }
    ;(await cookies()).set(OAUTH_VERIFIER_COOKIE, result.verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    })
    return { ok: true, url: result.redirect }
  } catch (error) {
    console.error("[auth] google falló:", error)
    return { ok: false, message: "No pudimos conectar con Google. Probá de nuevo en un rato." }
  }
}
