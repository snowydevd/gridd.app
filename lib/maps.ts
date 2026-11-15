/**
 * Links a Google Maps. Con las coordenadas el destino es exacto (como en la app,
 * mobile/src/app/event/[id].tsx); en el teléfono abren la app de Maps si está instalada.
 */

/** "Cómo llegar": abre la ruta desde donde está la persona hasta el evento. */
export const directionsUrl = (lat: number, lon: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`

/** El punto en el mapa, para que el organizador confirme que marcó bien el lugar. */
export const placeUrl = (lat: number, lon: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`

/** Mapa embebido sin API key, para la vista previa del lugar. */
export const embedUrl = (lat: number, lon: number) => `https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed`

/** Uruguay con margen; lo mismo que `UY_BOUNDS` de mobile/convex/lib/validation.ts. */
export const UY_BOUNDS = { minLat: -35.5, maxLat: -29.5, minLon: -59.0, maxLon: -52.5 }

export const inUruguay = (lat: number, lon: number) =>
  lat >= UY_BOUNDS.minLat && lat <= UY_BOUNDS.maxLat && lon >= UY_BOUNDS.minLon && lon <= UY_BOUNDS.maxLon

const NUM = String.raw`(-?\d{1,3}(?:\.\d+)?)`
// En orden: el pin de un lugar (!3d…!4d…), `q=`/`query=`/`ll=`/`destination=`, la cámara (@lat,lon), o
// coordenadas sueltas ("-34.9, -56.1").
const PATTERNS = [
  new RegExp(String.raw`!3d${NUM}!4d${NUM}`),
  new RegExp(String.raw`[?&](?:q|query|ll|destination|center)=${NUM},\s*${NUM}`),
  new RegExp(String.raw`@${NUM},${NUM}`),
  new RegExp(String.raw`^\s*${NUM}\s*,\s*${NUM}\s*$`),
]

/** Coordenadas de un link largo de Google Maps o de un "lat, lon" pegado. `null` si no hay. */
export function parseCoordinates(input: string): { lat: number; lon: number } | null {
  const text = decodeURIComponent(input.trim().replace(/\+/g, " "))
  for (const re of PATTERNS) {
    const m = text.match(re)
    if (!m) continue
    const lat = Number(m[1])
    const lon = Number(m[2])
    if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
      return { lat, lon }
    }
  }
  return null
}
