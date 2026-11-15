/**
 * Cómo se nombra el día de un evento en las tarjetas, igual que `formatWhen` de la app
 * (mobile/src/services/events.ts): "Hoy", "Mañana" o "Sáb 15". Todo en hora de Uruguay; `now` lo
 * pasa quien renderiza para que el server y el cliente digan lo mismo.
 */
const TZ = "America/Montevideo"
const DAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
const timeFmt = new Intl.DateTimeFormat("es-UY", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ })
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TZ })
const dayOfMonth = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: TZ })
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const DAY_MS = 24 * 60 * 60 * 1000

export type When = { day: string; time: string; isToday: boolean; isNow: boolean }

export function whenLabel(event: { startsAt: number; endsAt: number }, now: number): When {
  const day = ymd.format(event.startsAt)
  const isToday = day === ymd.format(now)
  const isTomorrow = day === ymd.format(now + DAY_MS)
  const label = isToday
    ? "Hoy"
    : isTomorrow
      ? "Mañana"
      : `${DAY_SHORT[WEEKDAYS.indexOf(weekday.format(event.startsAt))]} ${dayOfMonth.format(event.startsAt)}`
  return {
    day: label,
    time: timeFmt.format(event.startsAt),
    isToday,
    // Ya empezó y no terminó: la tarjeta dice "Ahora".
    isNow: event.startsAt <= now && event.endsAt >= now,
  }
}

/** La portada de la app cuando el evento no tiene una (mobile/assets/images/meets/midnight-rambla.jpg). */
export const DEFAULT_COVER = "/events/default-cover.jpg"
