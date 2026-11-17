// Anuncios de la web (AdSense), en los mismos lugares que la app (AdMob): el banner arriba de Inicio,
// Mapa, Próximos encuentros y Guardados, y tarjetas in-feed en "Para vos" y en las listas.
// Reglas de ubicación copiadas de mobile/src/lib/ads/placement.ts.

/** ID de editor de AdSense; el mismo de AdMob (`app-ads.txt` y `ads.txt`). */
export const ADSENSE_CLIENT = "ca-pub-7080266147615125"

export type AdsConfig = {
  enabled: boolean
  client: string
  /** Unidad de display adaptable para el banner de arriba. */
  bannerSlot?: string
  /** Unidad in-feed (formato `fluid`) para las tarjetas entre eventos. */
  feedSlot?: string
  /** `data-ad-layout-key` de la unidad in-feed (lo da AdSense al crearla). */
  feedLayoutKey?: string
  /** Pide anuncios de prueba (`data-adtest`): en desarrollo, para no generar impresiones reales. */
  test: boolean
}

/**
 * Lee la configuración del entorno (variables del Worker, ver wrangler.jsonc). Los anuncios se prenden
 * con `ADS_ENABLED=true`; cada lugar aparece recién cuando su unidad tiene ID.
 */
export function adsConfigFromEnv(env: Record<string, string | undefined> = process.env): AdsConfig {
  return {
    enabled: env.ADS_ENABLED === "true",
    client: env.ADSENSE_CLIENT || ADSENSE_CLIENT,
    bannerSlot: env.ADSENSE_BANNER_SLOT || undefined,
    feedSlot: env.ADSENSE_FEED_SLOT || undefined,
    feedLayoutKey: env.ADSENSE_FEED_LAYOUT_KEY || undefined,
    test: env.NODE_ENV !== "production",
  }
}

// Ninguna con menos de 5 eventos, nunca primera, la primera después del 5.º y después una cada 6.
const FIRST_AFTER = 4
const EVERY = 6

/** Índices (base 0) después de los cuales va una tarjeta, en una lista de `count` eventos. */
export function adSlotsFor(count: number): number[] {
  const slots: number[] = []
  for (let i = FIRST_AFTER; i < count; i += EVERY) slots.push(i)
  return slots
}

export type Slotted<T> = { kind: "event"; event: T } | { kind: "ad"; key: string }

/** Intercala tarjetas en secciones (ej. por fecha). La cuenta de eventos cruza las secciones. */
export function withAdSlots<T>(sections: T[][]): Slotted<T>[][] {
  const total = sections.reduce((n, s) => n + s.length, 0)
  const slots = new Set(adSlotsFor(total))
  let index = 0
  let ads = 0
  return sections.map((events) => {
    const items: Slotted<T>[] = []
    for (const event of events) {
      items.push({ kind: "event", event })
      if (slots.has(index)) items.push({ kind: "ad", key: `ad-${ads++}` })
      index++
    }
    return items
  })
}

/**
 * Dónde va la tarjeta en la grilla de "Para vos": debajo del evento grande, que sólo existe con
 * cantidad impar; si no hay, debajo del primer par. Con 0 o 1 evento, ninguna.
 */
export function gridSlot(count: number): "afterWide" | "afterFirstPair" | null {
  if (count < 2) return null
  return count % 2 === 1 ? "afterWide" : "afterFirstPair"
}
