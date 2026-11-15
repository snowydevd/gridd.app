"use server"

import { revalidatePath } from "next/cache"

import { withSession, type ActionResult } from "@/lib/authed"
import { mutation } from "@/lib/convex"

/**
 * Anotarse / bajarse de un evento (`attendance.toggle`). Sin sesión devuelve `reason: "auth"` y no
 * llama a Convex. El usuario sale del token, nunca de los argumentos.
 */
export async function toggleAttendance(input: { eventId: string; slug: string }): Promise<ActionResult<boolean>> {
  if (typeof input?.eventId !== "string" || typeof input?.slug !== "string") {
    return { ok: false, reason: "error", message: "No encontramos el evento." }
  }
  const result = await withSession("asistencia", "No pudimos anotarte. Revisá tu conexión y probá de nuevo.", async (token) => {
    const { attending } = await mutation<{ attending: boolean }>("attendance:toggle", { eventId: input.eventId }, token)
    return attending
  })
  if (result.ok) {
    revalidatePath(`/e/${input.slug}`)
    revalidatePath("/perfil")
  }
  return result
}
