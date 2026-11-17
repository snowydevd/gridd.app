"use server"

import { revalidatePath } from "next/cache"

import { withSession, type ActionResult } from "@/lib/authed"
import { action, KIND_LABELS, mutation } from "@/lib/convex"
import { clearSession, getToken } from "@/lib/session"

/**
 * Las acciones de las pantallas de la app que no tienen una página propia: guardar, intereses,
 * garage, seguir, reportar, eliminar la cuenta. Todas con el token de la sesión (nunca un userId del
 * cliente) y las mismas mutations que usa la app. Los mensajes de error de Convex llegan en español.
 */

const RETRY = "Revisá tu conexión y probá de nuevo."
const invalid = (message: string) => ({ ok: false, reason: "error", message }) as const
const isId = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length < 64

/** Lo que cambia se ve en todas las pestañas: se invalida todo el árbol. */
const refresh = () => revalidatePath("/", "layout")

async function run<T>(label: string, fallback: string, fn: (token: string) => Promise<T>): Promise<ActionResult<T>> {
  const result = await withSession(label, fallback, fn)
  if (result.ok) refresh()
  return result
}

/** Guarda o quita un evento de "Guardados" (`saves.toggle`). Devuelve si quedó guardado. */
export async function toggleSave(input: { eventId: string }): Promise<ActionResult<boolean>> {
  if (!isId(input?.eventId)) return invalid("No encontramos el evento.")
  return run("guardar", "No pudimos guardar el evento. " + RETRY, async (token) => {
    const { saved } = await mutation<{ saved: boolean }>("saves:toggle", { eventId: input.eventId }, token)
    return saved
  })
}

/** Categorías que le gustan (`users.setInterests`): reemplaza la lista entera. */
export async function setInterests(input: { interests: string[] }): Promise<ActionResult> {
  const interests = Array.isArray(input?.interests) ? input.interests.filter((k) => typeof k === "string" && k in KIND_LABELS) : null
  if (!interests) return invalid("Elegí tus intereses de la lista.")
  return run("intereses", "No pudimos guardar. " + RETRY, (token) =>
    mutation<null>("users:setInterests", { interests: [...new Set(interests)] }, token)
  )
}

export type CarInput = { make: string; model: string; year: number; version?: string; isModified: boolean }

/** Agrega (`cars.add`) o reemplaza (`cars.update`) un auto. El catálogo lo valida Convex. */
export async function saveCar(input: CarInput & { id?: string }): Promise<ActionResult> {
  if (
    typeof input?.make !== "string" ||
    typeof input.model !== "string" ||
    !Number.isInteger(input.year) ||
    (input.version !== undefined && typeof input.version !== "string")
  ) {
    return invalid("Elegí marca, modelo y año.")
  }
  const car = {
    make: input.make,
    model: input.model,
    year: input.year,
    version: input.version?.trim() || undefined,
    isModified: input.isModified === true,
  }
  return run("garage", "No pudimos guardar el auto. Probá de nuevo.", async (token) => {
    if (input.id !== undefined) {
      if (!isId(input.id)) throw new Error("id inválido")
      await mutation("cars:update", { id: input.id, ...car }, token)
    } else {
      await mutation("cars:add", car, token)
    }
    return null
  })
}

export async function removeCar(input: { id: string }): Promise<ActionResult> {
  if (!isId(input?.id)) return invalid("No encontramos el auto.")
  return run("garage:eliminar", "No pudimos eliminar el auto. Probá de nuevo.", (token) =>
    mutation<null>("cars:remove", { id: input.id }, token)
  )
}

/** Seguir / dejar de seguir a un organizador (`follows.toggle`). */
export async function toggleFollow(input: { organizerId: string }): Promise<ActionResult<boolean>> {
  if (!isId(input?.organizerId)) return invalid("No encontramos al organizador.")
  return run("seguir", "No pudimos actualizar. " + RETRY, async (token) => {
    const { following } = await mutation<{ following: boolean }>("follows:toggle", { organizerId: input.organizerId }, token)
    return following
  })
}

const REASONS = new Set(["spam", "fake", "offensive", "other"])

/** Reporta un evento (`reports.submit`) o a un usuario (`reports.submitUser`). */
export async function submitReport(input: {
  target: "event" | "user"
  id: string
  reason: string
  note?: string
}): Promise<ActionResult> {
  if (!isId(input?.id) || !REASONS.has(input.reason) || (input.target !== "event" && input.target !== "user")) {
    return invalid("Elegí un motivo.")
  }
  const note = typeof input.note === "string" && input.note.trim() ? input.note.trim().slice(0, 500) : undefined
  return withSession("reportar", "No pudimos enviar el reporte. " + RETRY, async (token) => {
    if (input.target === "user") await mutation("reports:submitUser", { userId: input.id, reason: input.reason, note }, token)
    else await mutation("reports:submit", { eventId: input.id, reason: input.reason, note }, token)
    return null
  })
}

/**
 * Borra la cuenta y todo lo suyo (`users.deleteAccount`) y cierra la sesión. Si tiene eventos próximos
 * publicados, Convex no deja (CONFLICT) y el mensaje dice qué hacer.
 */
export async function deleteAccount(): Promise<ActionResult> {
  const result = await withSession("cuenta:eliminar", "No pudimos eliminar tu cuenta. " + RETRY, (token) =>
    mutation<null>("users:deleteAccount", {}, token)
  )
  if (result.ok) {
    await clearSession()
    refresh()
  }
  return result
}

/**
 * URL de la imagen para historia de Instagram de un evento (`stories.eventStory`). Convex la genera la
 * primera vez (unos segundos) y después la reusa. Con sesión, así el organizador también puede la de
 * su evento oculto.
 */
export async function eventStoryUrl(input: { slug: string }): Promise<ActionResult<string>> {
  if (typeof input?.slug !== "string" || !input.slug) return invalid("No encontramos el evento.")
  try {
    const { url } = await action<{ url: string }>("stories:eventStory", { slug: input.slug }, await getToken())
    return { ok: true, value: url }
  } catch (error) {
    console.error("[historia] falló:", error)
    return invalid("No pudimos armar la imagen. " + RETRY)
  }
}
