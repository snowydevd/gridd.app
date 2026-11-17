"use client"

import { useEffect, useRef, useState } from "react"
import { Gps01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { EventRow } from "@/components/app/event-cards"
import { chipClass, iconButtonClass, text } from "@/components/app/ui"
import { KIND_LABELS, type GriddEvent } from "@/lib/convex"
import { whenLabel } from "@/lib/event-format"
import { loadGoogleMaps, mapLook, pinIcon } from "@/lib/google-maps"
import { requestLocation } from "@/lib/use-location"
import { useScheme } from "@/lib/use-scheme"
import { cn } from "@/lib/utils"

// Montevideo + Costa de Oro, como `INITIAL_REGION` en la app.
const INITIAL_CENTER = { lat: -34.86, lng: -56.04 }
const INITIAL_ZOOM = 11
const KINDS = Object.keys(KIND_LABELS)

/**
 * La pestaña Mapa (mobile/src/app/(tabs)/map.tsx): todos los encuentros próximos en Google Maps, los
 * chips de categoría arriba, "Centrar en mi ubicación" y la tarjeta del elegido abajo. Sin key de
 * Maps (o si Google la rechaza) queda la lista, para que la pestaña siga sirviendo.
 */
export function EventsMap({ events, now, mapsKey }: { events: GriddEvent[]; now: number; mapsKey?: string }) {
  const scheme = useScheme()
  const mapEl = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  const markers = useRef<google.maps.Marker[]>([])
  const userMarker = useRef<google.maps.Marker | null>(null)
  const [maps, setMaps] = useState<typeof google.maps | null>(null)
  const [failed, setFailed] = useState(!mapsKey)
  const [kind, setKind] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string>()
  const [locateError, setLocateError] = useState<string | null>(null)

  const visible = events.filter((e) => !kind || e.kind === kind)
  // Sin selección (o si la elegida quedó filtrada), el de hoy o el próximo.
  const selected =
    visible.find((e) => e._id === selectedId) ?? visible.find((e) => whenLabel(e, now).isToday) ?? visible[0]

  useEffect(() => {
    if (!mapsKey) return
    let cancelled = false
    loadGoogleMaps(mapsKey)
      .then((m) => {
        if (cancelled || !mapEl.current) return
        map.current = new m.Map(mapEl.current, {
          center: INITIAL_CENTER,
          zoom: INITIAL_ZOOM,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: "greedy",
          keyboardShortcuts: false,
        })
        setMaps(m)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [mapsKey])

  // El estilo sigue al tema, como el mapa de la app.
  useEffect(() => {
    map.current?.setOptions(mapLook(scheme))
  }, [maps, scheme])

  // Los pines se rehacen cuando cambia el filtro, la selección o el tema (son pocos: hasta 200).
  useEffect(() => {
    if (!maps || !map.current) return
    markers.current.forEach((m) => m.setMap(null))
    markers.current = visible.map((event) => {
      const isSelected = event._id === selected?._id
      const marker = new maps.Marker({
        map: map.current,
        position: { lat: event.lat, lng: event.lon },
        title: event.title,
        icon: pinIcon(maps, scheme, isSelected),
        zIndex: isSelected ? 2 : 1,
        optimized: true,
      })
      marker.addListener("click", () => {
        setSelectedId(event._id)
        map.current?.panTo({ lat: event.lat, lng: event.lon })
      })
      return marker
    })
    // `visible` cambia de identidad en cada render; alcanza con lo que la define.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps, scheme, kind, selected?._id, events])

  const pickKind = (k: string | null) => {
    setKind(k)
    setSelectedId(undefined)
  }

  const locate = async () => {
    setLocateError(null)
    try {
      const here = await requestLocation()
      const position = { lat: here.lat, lng: here.lon }
      if (maps && map.current) {
        userMarker.current?.setMap(null)
        userMarker.current = new maps.Marker({
          map: map.current,
          position,
          clickable: false,
          zIndex: 3,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        })
        map.current.panTo(position)
        map.current.setZoom(14)
      }
    } catch (error) {
      const denied = error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED
      setLocateError(
        denied
          ? "Sin acceso a tu ubicación. Activalo en Ajustes → Safari → Ubicación para ver los encuentros cerca tuyo."
          : "No pudimos ubicarte. Revisá que la ubicación esté activada."
      )
    }
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-raised">
      {failed ? (
        <div className="absolute inset-0 overflow-y-auto px-4 pt-[calc(env(safe-area-inset-top)+4.5rem)] pb-48">
          <p className={cn(text.caption, "mb-2 text-muted-foreground")}>
            No pudimos cargar el mapa. Estos son los encuentros próximos:
          </p>
          {visible.map((e) => (
            <EventRow key={e._id} event={e} now={now} />
          ))}
        </div>
      ) : (
        <div ref={mapEl} className="absolute inset-0" aria-label="Mapa de encuentros" role="region" />
      )}

      <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+0.75rem)] flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <button type="button" aria-pressed={!kind} onClick={() => pickKind(null)} className={cn(chipClass(!kind), "shadow-sm")}>
          Todos
        </button>
        {KINDS.map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => pickKind(k)} className={cn(chipClass(kind === k), "shadow-sm")}>
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3">
        {!failed && (
          <button type="button" onClick={() => void locate()} aria-label="Centrar en mi ubicación" className={cn(iconButtonClass(), "self-end shadow-sm")}>
            <HugeiconsIcon icon={Gps01Icon} strokeWidth={1.8} aria-hidden className="size-5" />
          </button>
        )}
        {locateError && (
          <p role="alert" className={cn(text.caption, "rounded-[12px] border border-border bg-card p-3")}>
            {locateError}
          </p>
        )}
        {selected ? (
          <div className="rounded-[16px] border border-border bg-raised px-3 py-1 shadow-lg">
            <EventRow event={selected} now={now} />
          </div>
        ) : (
          <div className="rounded-[16px] border border-border bg-raised p-4 text-center shadow-lg">
            <p className={cn(text.body, "text-muted-foreground")}>
              {kind ? `No hay encuentros de ${KIND_LABELS[kind]} próximos.` : "No hay encuentros próximos."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
