"use server"

import { ConvexCallError, KIND_LABELS, mutation } from "@/lib/convex"

export type Crowd = "lt30" | "30_100" | "100_300" | "gt300"

export type JoinInput = { instagram: string; kinds: string[]; crowd: Crowd }

export type JoinResult = { ok: true } | { ok: false; message: string }

/**
 * Anota a un organizador en la waitlist (`waitlist:join` en mobile/convex). Es pública a propósito:
 * no hay sesión. La validación de verdad la hace Convex; acá sólo se filtra lo que no tiene forma.
 */
export async function joinWaitlist(input: JoinInput): Promise<JoinResult> {
  const kinds = Array.isArray(input?.kinds) ? input.kinds.filter((k) => k in KIND_LABELS) : []
  if (typeof input?.instagram !== "string" || kinds.length === 0) {
    return { ok: false, message: "Faltan datos. Revisá el formulario." }
  }
  try {
    await mutation("waitlist:join", { instagram: input.instagram, kinds, crowd: input.crowd })
    return { ok: true }
  } catch (error) {
    // Los errores de `fail()` traen un mensaje para mostrar; el resto es un problema nuestro.
    if (error instanceof ConvexCallError && error.data?.message) return { ok: false, message: error.data.message }
    console.error("[waitlist] join falló:", error)
    return { ok: false, message: "No pudimos anotarte. Probá de nuevo en un rato." }
  }
}
