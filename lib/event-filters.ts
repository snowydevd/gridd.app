import type { GriddEvent } from "@/lib/convex"

/** "Hoy" y "Este finde" se cuentan en hora de Uruguay (UTC−3, sin horario de verano desde 2015). */
const UY_OFFSET = 3 * 60 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000

export type When = "all" | "today" | "weekend"

export type EventFilters = { text: string; kind: string | null; when: When }

/** Medianoche (hora de Uruguay) del día de `ts`. */
function startOfDay(ts: number) {
  return Math.floor((ts - UY_OFFSET) / DAY) * DAY + UY_OFFSET
}

/** Rango [desde, hasta) de "Hoy" o "Este finde": sábado y domingo, el actual o el próximo. */
export function whenRange(when: Exclude<When, "all">, now: number): [number, number] {
  const today = startOfDay(now)
  if (when === "today") return [today, today + DAY]
  const weekday = new Date(today - UY_OFFSET).getUTCDay() // 0 = domingo, 6 = sábado
  const saturday = weekday === 6 ? today : weekday === 0 ? today - DAY : today + (6 - weekday) * DAY
  return [saturday, saturday + 2 * DAY]
}

/** Minúsculas y sin tildes: "rodada" encuentra "Rodadá" y "MONTEVIDEO" encuentra "Montevideo". */
function normalize(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
}

/** Filtra por texto (título o lugar), categoría y cuándo. Un evento entra si se solapa con el rango. */
export function filterEvents(events: GriddEvent[], filters: EventFilters, now: number): GriddEvent[] {
  const words = normalize(filters.text).split(/\s+/).filter(Boolean)
  const range = filters.when === "all" ? null : whenRange(filters.when, now)
  return events.filter((e) => {
    if (filters.kind && e.kind !== filters.kind) return false
    if (range && !(e.startsAt < range[1] && e.endsAt >= range[0])) return false
    const haystack = normalize(`${e.title} ${e.placeName}`)
    return words.every((w) => haystack.includes(w))
  })
}
