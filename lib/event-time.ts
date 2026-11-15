/**
 * Fechas de los formularios de eventos, en hora de Uruguay (UTC−3 fijo, sin horario de verano desde
 * 2015; igual que lib/event-filters.ts). Así un evento cargado desde otro huso horario queda bien.
 */
const UY_OFFSET = "-03:00"
const UY_OFFSET_MS = 3 * 60 * 60 * 1000

/** "2026-11-20" + "21:30" → ms. `null` si alguno no tiene forma. */
export function toTimestamp(day: string, time: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{2}:\d{2}$/.test(time)) return null
  const ms = Date.parse(`${day}T${time}:00${UY_OFFSET}`)
  return Number.isFinite(ms) ? ms : null
}

/** ms → `{ day: "2026-11-20", time: "21:30" }` en hora de Uruguay, para precargar el formulario. */
export function fromTimestamp(ms: number): { day: string; time: string } {
  const iso = new Date(ms - UY_OFFSET_MS).toISOString()
  return { day: iso.slice(0, 10), time: iso.slice(11, 16) }
}

/**
 * La hora del pedido, para las páginas del server que separan próximos de pasados. Las páginas con
 * sesión se renderizan en cada request (leen cookies), así que es la hora real de la visita.
 */
export const requestTime = () => Date.now()
