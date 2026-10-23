import { cache } from "react"

/**
 * Lectura de Convex (el backend de la app mobile) por su API HTTP, sin el SDK:
 * la web sólo necesita un par de queries públicas, del lado del server.
 * `CONVEX_URL` es la URL del deployment (https://<nombre>.convex.cloud).
 */
async function query<T>(path: string, args: Record<string, unknown>): Promise<T> {
  const url = process.env.CONVEX_URL
  if (!url) throw new Error("Falta CONVEX_URL.")
  const res = await fetch(`${url}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
    // Un evento cambia (anotados, cancelado): siempre el dato fresco.
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Convex respondió ${res.status} en ${path}.`)
  const body = (await res.json()) as { status: "success"; value: T } | { status: "error"; errorMessage: string }
  if (body.status !== "success") throw new Error(body.errorMessage)
  return body.value
}

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
  organizer: { _id: string; name: string | null; image: string | null } | null
}

/** Un evento por slug, o `null`. `cache` evita pedirlo dos veces (metadata + página). */
export const getEvent = cache((slug: string) => query<GriddEvent | null>("events:getBySlug", { slug }))

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
  otro: "Otro",
}
