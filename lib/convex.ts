import { cache } from "react"

/**
 * Convex (el backend de la app mobile) por su API HTTP, sin el SDK: la web sólo necesita un par
 * de funciones públicas, del lado del server.
 * `CONVEX_URL` es la URL del deployment (https://<nombre>.convex.cloud).
 */
async function call<T>(kind: "query" | "mutation", path: string, args: Record<string, unknown>): Promise<T> {
  const url = process.env.CONVEX_URL
  if (!url) throw new Error("Falta CONVEX_URL.")
  const res = await fetch(`${url}/api/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
    // Un evento cambia (anotados, cancelado): siempre el dato fresco.
    cache: "no-store",
  })
  const body = (await res.json().catch(() => null)) as
    | { status: "success"; value: T }
    | { status: "error"; errorMessage: string; errorData?: { code?: string; message?: string } }
    | null
  if (!body) throw new Error(`Convex respondió ${res.status} en ${path}.`)
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

const query = <T>(path: string, args: Record<string, unknown>) => call<T>("query", path, args)
export const mutation = <T>(path: string, args: Record<string, unknown>) => call<T>("mutation", path, args)

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
