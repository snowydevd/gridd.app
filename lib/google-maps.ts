/**
 * Carga del SDK de Google Maps en el navegador, una sola vez por página. La key es de navegador
 * (restringida por dominio en Google Cloud), así que puede viajar al cliente.
 */

let loading: Promise<typeof google.maps> | null = null

declare global {
  interface Window {
    __griddMapsReady?: () => void
    gm_authFailure?: () => void
  }
}

/** Se rechaza si el script no carga o si Google rechaza la key (dominio no habilitado, API apagada). */
export function loadGoogleMaps(apiKey: string): Promise<typeof google.maps> {
  if (typeof window === "undefined") return Promise.reject(new Error("Sólo en el navegador"))
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps)
  if (loading) return loading

  loading = new Promise((resolve, reject) => {
    window.__griddMapsReady = () => resolve(window.google.maps)
    // Google no rechaza la promesa cuando la key falla: avisa por este global.
    window.gm_authFailure = () => reject(new Error("La key de Google Maps fue rechazada"))
    const params = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      libraries: "places",
      language: "es",
      region: "UY",
      loading: "async",
      callback: "__griddMapsReady",
    })
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error("No se pudo cargar Google Maps"))
    }
    document.head.appendChild(script)
  })
  return loading
}

/**
 * El estilo oscuro de la app (mobile/src/constants/map-style.ts): asfalto, sin puntos de interés ni
 * transporte. La clara está más abajo (`LIGHT_MAP_STYLE`).
 */
export const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#111214" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8A8F98" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B0B0C" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2A2C30" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4A4E55" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#141714" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1F2125" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#17181B" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#26282D" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2E3036" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#A6ABB3" }],
  },
  {
    featureType: "road.local",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0D0F12" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4A4E55" }],
  },
]

/** Versión clara ("Papel") de mobile/src/constants/map-style.ts: mismas reglas con los tokens claros. */
export const LIGHT_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#F6F5F0" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5E6168" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F6F5F0" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#E1DFD7" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.neighborhood", elementType: "labels.text.fill", stylers: [{ color: "#A3A6AC" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#E9EBDF" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#E1DFD7" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#EEEDE7" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#5E6168" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#DCE3E6" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#A3A6AC" }] },
]

/** Estilo y fondo del mapa según el tema que se ve. */
export const mapLook = (scheme: "light" | "dark") =>
  scheme === "light"
    ? { styles: LIGHT_MAP_STYLE, backgroundColor: "#F6F5F0" }
    : { styles: DARK_MAP_STYLE, backgroundColor: "#111214" }

/**
 * Pin de Gridd, como en la app: chico, o grande si está elegido. En el mapa claro el lima no se
 * distingue del fondo y esos pines llevan contorno oscuro. La punta está abajo al centro (≈96%).
 */
export function pinIcon(maps: typeof google.maps, scheme: "light" | "dark", selected: boolean): google.maps.Icon {
  const size = selected ? 46 : 30
  const file = `${selected ? "pin-large" : "pin-small"}${scheme === "light" ? "-light" : ""}.png`
  return {
    url: `/brand/${file}`,
    scaledSize: new maps.Size(size, size),
    anchor: new maps.Point(size / 2, size * 0.96),
  }
}
