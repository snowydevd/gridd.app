"use server"

import { revalidatePath } from "next/cache"

import { withSession, type ActionResult } from "@/lib/authed"
import { KIND_LABELS, mutation } from "@/lib/convex"
import { toTimestamp } from "@/lib/event-time"
import { parseCoordinates } from "@/lib/maps"
import { actionToken } from "@/lib/session"

const RETRY = "Revisá tu conexión y probá de nuevo."

/** Lo que manda el formulario. Día y horas en hora de Uruguay; el fin es el mismo día (como la app). */
export type EventFormInput = {
  title: string
  description: string
  kind: string
  day: string
  start: string
  end: string | null
  noEndTime: boolean
  placeName: string
  lat: number
  lon: number
  /** Hay que pagar entrada; el precio (pesos, entero) va en `entryCost`. */
  paidEvent: boolean
  entryCost?: number
  isSolidary: boolean
}

/** Tope del precio de la entrada (`MAX_ENTRY_COST` en mobile/convex/lib/validation.ts). */
const MAX_ENTRY_COST = 1_000_000

type ConvexEventFields = {
  title: string
  description: string
  kind: string
  startsAt: number
  endsAt?: number
  noEndTime: boolean
  placeName: string
  lat: number
  lon: number
  paidEvent: boolean
  entryCost?: number
  isSolidary: boolean
}

/** Pasa el formulario a los campos de `events.create` / `events.update`. Lo demás lo valida Convex. */
function toFields(input: EventFormInput): ConvexEventFields | string {
  if (
    typeof input?.title !== "string" ||
    typeof input.description !== "string" ||
    typeof input.placeName !== "string" ||
    !(input.kind in KIND_LABELS) ||
    !Number.isFinite(input.lat) ||
    !Number.isFinite(input.lon)
  ) {
    return "Faltan datos. Revisá el formulario."
  }
  const startsAt = toTimestamp(input.day, input.start)
  if (startsAt === null) return "Elegí el día y la hora de inicio."
  const noEndTime = input.noEndTime === true
  let endsAt: number | undefined
  if (!noEndTime) {
    endsAt = toTimestamp(input.day, input.end ?? "") ?? undefined
    if (endsAt === undefined) return 'Elegí la hora de fin o marcá "Sin hora de fin".'
  }
  const paidEvent = input.paidEvent === true
  // Con entrada libre no se manda precio: Convex borra uno que haya quedado de antes.
  const entryCost = paidEvent ? input.entryCost : undefined
  if (paidEvent && (!Number.isInteger(entryCost) || entryCost! < 1 || entryCost! > MAX_ENTRY_COST)) {
    return "El precio de la entrada tiene que ser un número entero entre 1 y 1.000.000."
  }
  return {
    title: input.title,
    description: input.description,
    kind: input.kind,
    startsAt,
    endsAt,
    noEndTime,
    placeName: input.placeName,
    lat: input.lat,
    lon: input.lon,
    paidEvent,
    entryCost,
    isSolidary: input.isSolidary === true,
  }
}

const invalid = (message: string) => ({ ok: false, reason: "error", message }) as const

/** URL de un solo uso para subir la portada directo a Convex (`files.generateUploadUrl`, sólo publishers). */
export async function coverUploadUrl(): Promise<ActionResult<string>> {
  return withSession("panel:upload-url", RETRY, (token) => mutation<string>("files:generateUploadUrl", {}, token))
}

/** Publica un evento (`events.create`). Devuelve el slug para abrir la ficha. */
export async function createEvent(input: EventFormInput & Partial<CoverInput>): Promise<ActionResult<string>> {
  const fields = toFields(input)
  if (typeof fields === "string") return invalid(fields)
  const image = coverFields(input)
  const result = await withSession("panel:crear", "No pudimos publicar. " + RETRY, async (token) => {
    const { slug } = await mutation<{ id: string; slug: string }>("events:create", { ...fields, ...image }, token)
    return slug
  })
  if (result.ok) {
    revalidatePath("/organizadores/panel")
    revalidatePath("/eventos")
  }
  return result
}

/** Una portada recién subida, con sus medidas (px) para la grilla de flyers. */
type CoverInput = { imageId: string; imageWidth: number; imageHeight: number }

const isSize = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0

/** El id de la portada y sus medidas si llegan bien; medidas raras se descartan (en el backend son opcionales). */
function coverFields(input: Partial<CoverInput> | undefined) {
  if (typeof input?.imageId !== "string") return {}
  return isSize(input.imageWidth) && isSize(input.imageHeight)
    ? { imageId: input.imageId, imageWidth: input.imageWidth, imageHeight: input.imageHeight }
    : { imageId: input.imageId }
}

/**
 * Edita un evento propio (`events.update`). `cover`: `"keep"` deja la portada, `"remove"` la quita y
 * un id de storage pone una nueva. El slug no cambia, así los links compartidos siguen andando.
 */
export async function updateEvent(
  input: EventFormInput & { id: string; slug: string; cover: "keep" | "remove" | CoverInput }
): Promise<ActionResult> {
  if (typeof input?.id !== "string" || typeof input.slug !== "string") return invalid("No encontramos el evento.")
  const fields = toFields(input)
  if (typeof fields === "string") return invalid(fields)
  const cover =
    input.cover === "remove"
      ? { removeImage: true }
      : typeof input.cover === "object"
        ? coverFields(input.cover)
        : {}
  const result = await withSession("panel:editar", "No pudimos guardar los cambios. " + RETRY, async (token) => {
    await mutation("events:update", { id: input.id, ...fields, ...cover }, token)
    return null
  })
  if (result.ok) revalidateEvent(input.slug)
  return result
}

/** Cancela un evento propio y publicado (`events.cancel`). No se puede deshacer. */
export async function cancelEvent(input: { id: string; slug: string }): Promise<ActionResult> {
  if (typeof input?.id !== "string" || typeof input.slug !== "string") return invalid("No encontramos el evento.")
  const result = await withSession("panel:cancelar", "No pudimos cancelar el evento. " + RETRY, async (token) => {
    await mutation("events:cancel", { id: input.id }, token)
    return null
  })
  if (result.ok) revalidateEvent(input.slug)
  return result
}

function revalidateEvent(slug: string) {
  revalidatePath(`/e/${slug}`)
  revalidatePath("/organizadores/panel")
  revalidatePath("/eventos")
}

/** Hosts de los links cortos de Google Maps: se siguen del lado del server para leer las coordenadas. */
const SHORT_LINK_HOSTS = new Set(["maps.app.goo.gl", "goo.gl", "g.co"])
const isShortLink = (url: URL) =>
  url.protocol === "https:" && SHORT_LINK_HOSTS.has(url.hostname.toLowerCase().replace(/\.$/, ""))

/**
 * Coordenadas de lo que pegó el organizador: "lat, lon", un link largo de Google Maps o uno corto
 * (maps.app.goo.gl/…, el que da "Compartir" en el teléfono). El corto se sigue a mano, sólo hacia
 * dominios de Google, para no convertir esto en un proxy a cualquier URL.
 */
export async function resolvePlace(input: { text: string }): Promise<ActionResult<{ lat: number; lon: number }>> {
  // Sólo con sesión: es un fetch a internet desde el server y no tiene por qué ser público.
  if (!(await actionToken())) return { ok: false, reason: "auth" }
  const text = typeof input?.text === "string" ? input.text.trim() : ""
  const direct = parseCoordinates(text)
  if (direct) return { ok: true, value: direct }

  let url: URL
  try {
    url = new URL(text)
  } catch {
    return invalid("Pegá un link de Google Maps o las coordenadas (ej: -34.9, -56.16).")
  }
  if (!isShortLink(url)) {
    return invalid("No encontramos las coordenadas en ese link. Probá con el link de \"Compartir\" de Google Maps.")
  }

  try {
    // Sólo se hace fetch a los acortadores de Google. Del destino (google.com/maps/…) se leen las
    // coordenadas del header Location, sin pedirlo: así nunca se sale a un host que no elegimos.
    for (let hop = 0; hop < 5 && isShortLink(url); hop++) {
      const res = await fetch(url, { redirect: "manual", cache: "no-store" })
      const location = res.headers.get("location")
      if (!location) break
      url = new URL(location, url)
      const found = parseCoordinates(url.toString())
      if (found) return { ok: true, value: found }
    }
  } catch (error) {
    console.error("[panel] seguir link de maps falló:", error)
  }
  return invalid("No pudimos leer ese link. Abrilo en Google Maps y pegá las coordenadas del lugar.")
}
