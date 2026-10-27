"use server"

import { ConvexCallError, mutation } from "@/lib/convex"

export type Platform = "android" | "ios"

export type JoinTestersResult = { ok: true } | { ok: false; message: string }

/**
 * Anota un mail para la beta (`testers:join` en mobile/convex). Pública a propósito: no hay sesión.
 * La validación de verdad la hace Convex; acá sólo se filtra lo que no tiene forma.
 */
export async function joinTesters(input: { email: string; platform: Platform }): Promise<JoinTestersResult> {
  if (typeof input?.email !== "string" || !["android", "ios"].includes(input?.platform)) {
    return { ok: false, message: "Faltan datos. Revisá el formulario." }
  }
  try {
    await mutation("testers:join", { email: input.email, platform: input.platform })
    return { ok: true }
  } catch (error) {
    // Los errores de `fail()` traen un mensaje para mostrar; el resto es un problema nuestro.
    if (error instanceof ConvexCallError && error.data?.message) return { ok: false, message: error.data.message }
    console.error("[testers] join falló:", error)
    return { ok: false, message: "No pudimos anotarte. Probá de nuevo en un rato." }
  }
}
