import { cache } from "react"

import { UY_BOUNDS } from "@/lib/maps"
import type { SearchRadius } from "@/lib/search-radius"

/**
 * Convex (el backend de la app mobile) por su API HTTP, sin el SDK: la web sólo necesita un par
 * de funciones públicas, del lado del server.
 * `CONVEX_URL` es la URL del deployment (https://<nombre>.convex.cloud).
 */
async function call<T>(kind: "query" | "mutation" | "action", path: string, args: Record<string, unknown>, authToken?: string): Promise<T> {
  const url = process.env.CONVEX_URL
  if (!url) throw new Error("Falta CONVEX_URL.");

  const res = await fetch(`${url}/api/${kind}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(authToken ? {
        "Authorization": `Bearer ${authToken}`
      } : {})
    },
    body: JSON.stringify({ path, args, format: "json" }),
    // Un evento cambia (anotados, cancelado): siempre el dato fresco.
    cache: "no-store",
  })

  const body = (await res.json().catch(() => null)) as
    | { status: "success"; value: T }
    | { status: "error"; errorMessage: string; errorData?: { code?: string; message?: string } }
    // Un header de auth inválido (token roto o vencido) vuelve sin `status`, con `{ code, message }`.
    | { status?: undefined; code: string; message: string }
    | null
  if (!body) throw new Error(`Convex respondió ${res.status} en ${path}.`)
  if (body.status === undefined) throw new ConvexCallError(`${body.code}: ${body.message}`)
  if (body.status !== "success") throw new ConvexCallError(body.errorMessage, body.errorData)
  return body.value
}

/** Error de una función de Convex; `data` trae el `{ code, message }` de `fail()` si lo hay. */
export class ConvexCallError extends Error {
  constructor(
    message: string,
    readonly data?: { code?: string; message?: string }
  ) {
    super(message)
  }
}

export const query = <T>(path: string, args: Record<string, unknown>, authToken?: string) => call<T>("query", path, args, authToken)
export const mutation = <T>(path: string, args: Record<string, unknown>, authToken?: string) => call<T>("mutation", path, args, authToken)
export const action = <T>(path: string, args: Record<string, unknown>, authToken?: string) => call<T>("action", path, args, authToken)

/** La forma de `events.getBySlug` (mobile/convex/lib/eventView.ts), con lo que usa la web. */
export type GriddEvent = {
  _id: string
  slug: string
  title: string
  description: string
  kind: string
  startsAt: number
  endsAt: number
  noEndTime?: boolean
  placeName: string
  lat: number
  lon: number
  status: "published" | "cancelled" | "hidden"
  attendeeCount: number
  imageUrl: string | null
  /** Medidas de la portada guardada (px); faltan en las viejas que el backfill no pudo leer. */
  imageWidth?: number
  imageHeight?: number
  paidEvent?: boolean
  /** Precio de la entrada (pesos); sólo si `paidEvent`. */
  entryCost?: number
  isSolidary?: boolean
  organizer: { _id: string; name: string | null; image: string | null } | null
  /** Última edición (ms); la usa el sitemap. */
  updatedAt?: number
}

/** Un evento por slug, o `null`. `cache` evita pedirlo dos veces (metadata + página). */
export const getEvent = cache((slug: string) => query<GriddEvent | null>("events:getBySlug", { slug }))

/** Lo mismo, como el usuario de la sesión: el organizador ve también su evento oculto. */
export const getEventAs = cache(async (slug: string, token: string) => {
  try {
    return await query<GriddEvent | null>("events:getBySlug", { slug }, token)
  } catch (error) {
    // Si Convex rechaza el token, la ficha igual se ve: como anónimo.
    if (error instanceof ConvexCallError) return getEvent(slug)
    throw error
  }
})

export type Role = "user" | "publisher" | "admin"

/** La forma de `users.me` (mobile/convex/users.ts). */
export type Viewer = {
  _id: string
  name: string | null
  email: string | null
  image: string | null
  /** Foto subida por el usuario (no la del login social): se puede quitar. */
  hasAvatar: boolean
  hasPassword: boolean
  role: Role
  /** Rango de "Cerca tuyo" (lib/search-radius.ts). */
  searchRadius: SearchRadius
  /** Categorías que le gustan, para ordenar "Para vos" en Inicio. */
  interests: string[]
}

/** Publisher o admin: puede publicar eventos (`requirePublisher` en mobile/convex/lib/auth.ts). */
export const isPublisher = (viewer: Viewer) => viewer.role === "publisher" || viewer.role === "admin"

/** El usuario de la sesión, o `null`. Sin token ni se consulta. La identidad viaja sólo en el token. */
export const getViewer = cache(async (token: string | undefined): Promise<Viewer | null> => {
  if (!token) return null
  try {
    return await query<Viewer | null>("users:me", {}, token)
  } catch (error) {
    // Un token que Convex rechaza (firma vieja, sesión borrada) es lo mismo que no tener sesión.
    if (error instanceof ConvexCallError) return null
    throw error
  }
})

/** La forma de `publisherRequests.mine`: la última solicitud para organizar, o `null`. */
export type PublisherRequest = {
  _id: string
  _creationTime: number
  message: string
  status: "pending" | "approved" | "rejected"
  reviewedAt?: number
} | null

type Page<T> = { page: T[]; isDone: boolean; continueCursor: string }

/**
 * Próximos encuentros publicados (los que no terminaron), del más cercano al más lejano, hasta `max`.
 * Usa `events.listUpcoming`, la misma consulta que la lista de la app. Devuelve también el `now` de
 * la consulta, para que los filtros "Hoy" / "Este finde" usen el mismo instante.
 */
export async function listUpcomingEvents(max = 100): Promise<{ events: GriddEvent[]; now: number }> {
  // `now` fijo para todas las páginas: si cambiara, los cursores dejarían de valer.
  const now = Date.now()
  const events: GriddEvent[] = []
  let cursor: string | null = null
  while (events.length < max) {
    const result: Page<GriddEvent> = await query("events:listUpcoming", {
      paginationOpts: { numItems: Math.min(50, max - events.length), cursor },
      now,
    })
    events.push(...result.page)
    if (result.isDone) break
    cursor = result.continueCursor
  }
  return { events, now }
}

const DAY = 24 * 60 * 60 * 1000

/**
 * Eventos para el mapa (`events.listInBounds`, como `useMapEvents` en la app): los publicados en todo
 * Uruguay que todavía no terminaron. Arranca una semana atrás porque un evento puede durar hasta 7 días.
 */
export async function listMapEvents(): Promise<{ events: GriddEvent[]; now: number }> {
  const now = Date.now()
  const from = now - 7 * DAY
  const events = await query<GriddEvent[]>("events:listInBounds", { ...UY_BOUNDS, from, to: from + 90 * DAY })
  return { events: events.filter((e) => e.endsAt >= now).sort((a, b) => a.startsAt - b.startsAt), now }
}

export type VehicleType = "car" | "motorcycle"

/** Un auto o moto del garage (`cars.listMine`). Sin `type` es un auto (los anteriores a las motos). */
export type Car = {
  _id: string
  type?: VehicleType
  make: string
  model: string
  year?: number
  version?: string
  isModified?: boolean
}

/** "Volkswagen Saveiro G5", como `carTitle` en la app. */
export const carTitle = (car: Pick<Car, "make" | "model" | "version">) =>
  [car.make, car.model, car.version].filter(Boolean).join(" ")

/** Quién va a un evento (`attendance.list`). */
export type Attendee = {
  _id: string
  name: string | null
  image: string | null
  car: { type?: VehicleType; make: string; model: string; version: string | null; year: number | null } | null
}

/** "Subaru WRX STI 2008": el auto de un anotado en una línea. */
export const attendeeCar = (car: NonNullable<Attendee["car"]>) =>
  [car.make, car.model, car.version, car.year].filter(Boolean).join(" ")

/** Perfil público de un organizador (`organizers.get`). */
export type OrganizerProfile = {
  _id: string
  name: string | null
  image: string | null
  verified: boolean
  followerCount: number
  isFollowing: boolean
  upcoming: GriddEvent[]
  past: GriddEvent[]
}

/**
 * Perfil público de un organizador, o `null`. Convex sólo lo da si sigue siendo organizador (un
 * usuario común, o uno al que le sacaron el permiso, no tiene perfil público). Un id con forma
 * inválida es lo mismo que uno que no existe.
 */
export const getOrganizer = cache(async (id: string, token?: string) => {
  try {
    return await query<OrganizerProfile | null>("organizers:get", { userId: id }, token)
  } catch (error) {
    if (error instanceof ConvexCallError) return null
    throw error
  }
})

/** Las mismas etiquetas que la app (mobile/src/services/events.ts). */
export const KIND_LABELS: Record<string, string> = {
  junada: "Encuentro",
  rodada: "Rodada",
  cars_and_coffee: "Cars & Coffee",
  expo: "Exposición",
  clasicos: "Clásicos",
  jdm: "JDM",
  tuning: "Tuning",
  "4x4": "4x4",
  motos: "Motos",
  pista: "Pista",
  // Spotters que sacan fotos de vehículos en movimiento (p. ej. en la rambla) para después venderlas.
  barridos: "Barridos (fotos)",
  otro: "Otro",
}
