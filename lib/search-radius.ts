/**
 * Rangos de "Cerca tuyo", en km: los mismos que mobile/convex/lib/searchRadius.ts. "all" (+500 km)
 * cubre todo Uruguay. Se eligen en Inicio (la cápsula de arriba) o en el perfil (Ubicación).
 */
export const SEARCH_RADII = [10, 25, 50, 100, 200, 500, "all"] as const
export type SearchRadius = (typeof SEARCH_RADII)[number]

export const DEFAULT_SEARCH_RADIUS: SearchRadius = 25

export const searchRadiusLabel = (radius: SearchRadius) => (radius === "all" ? "+500 km" : `${radius} km`)

/** Si un evento a `distanceKm` entra en el rango. */
export const withinRadius = (distanceKm: number, radius: SearchRadius) => radius === "all" || distanceKm <= radius

export const isSearchRadius = (value: unknown): value is SearchRadius =>
  (SEARCH_RADII as readonly unknown[]).includes(value)

type LatLng = { lat: number; lon: number }

/** Distancia en km entre dos puntos (haversine), como `distanceKm` en mobile/src/services/events.ts. */
export function distanceKm(a: LatLng, b: LatLng) {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

/** "1,4 km" o "23 km", como `formatKm` en la app. */
export const formatKm = (km: number) => (km < 10 ? `${km.toFixed(1).replace(".", ",")} km` : `${Math.round(km)} km`)
