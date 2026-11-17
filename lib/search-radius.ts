/**
 * Rango de "Cerca tuyo" de la app (mobile/convex/lib/searchRadius.ts). La web no filtra por distancia,
 * pero `users.me` lo devuelve: el tipo queda para `Viewer`.
 */
export type SearchRadius = 10 | 25 | 50 | 100 | 200 | 500 | "all"

type LatLng = { lat: number; lon: number }

/** Distancia en km entre dos puntos (haversine), como `distanceKm` en mobile/src/services/events.ts. */
export function distanceKm(a: LatLng, b: LatLng) {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

/** "1,4 km" o "23 km", como `formatKm` en la app. Sólo se muestra si ya hay permiso de ubicación. */
export const formatKm = (km: number) => (km < 10 ? `${km.toFixed(1).replace(".", ",")} km` : `${Math.round(km)} km`)
