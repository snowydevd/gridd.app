"use client"

import { useEffect, useRef, useState } from "react"

import { loadGoogleMaps, mapLook, pinIcon } from "@/lib/google-maps"
import { embedUrl } from "@/lib/maps"
import { useScheme } from "@/lib/use-scheme"

/** Zoom de barrio: se ve la calle y un par de cuadras alrededor (`MAP_DELTA` en la app). */
const PLACE_ZOOM = 15

/**
 * El mapita de la ficha: quieto, con el pin de Gridd; tocarlo abre "Cómo llegar". Sin key de Maps (o
 * si Google la rechaza) queda el mapa embebido público de Google.
 */
export function PlaceMap({
  lat,
  lon,
  label,
  mapsKey,
  onOpen,
}: {
  lat: number
  lon: number
  label: string
  mapsKey?: string
  onOpen: () => void
}) {
  const scheme = useScheme()
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  const marker = useRef<google.maps.Marker | null>(null)
  const [maps, setMaps] = useState<typeof google.maps | null>(null)
  const [failed, setFailed] = useState(!mapsKey)

  useEffect(() => {
    if (!mapsKey) return
    let cancelled = false
    loadGoogleMaps(mapsKey)
      .then((m) => {
        if (cancelled || !el.current) return
        map.current = new m.Map(el.current, {
          center: { lat, lng: lon },
          zoom: PLACE_ZOOM,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: "none",
          keyboardShortcuts: false,
        })
        map.current.addListener("click", onOpen)
        setMaps(m)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
    // El mapa se crea una vez por evento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsKey, lat, lon])

  useEffect(() => {
    if (!maps || !map.current) return
    map.current.setOptions(mapLook(scheme))
    marker.current?.setMap(null)
    marker.current = new maps.Marker({ map: map.current, position: { lat, lng: lon }, title: label, icon: pinIcon(maps, scheme, true) })
    marker.current.addListener("click", onOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps, scheme, lat, lon, label])

  return (
    <div className="relative h-[180px] overflow-hidden rounded-[16px] border border-border bg-raised">
      {failed ? (
        <iframe
          title={`Mapa: ${label}`}
          src={embedUrl(lat, lon)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full"
        />
      ) : (
        <div ref={el} className="absolute inset-0" role="img" aria-label={`Mapa: ${label}`} />
      )}
    </div>
  )
}
