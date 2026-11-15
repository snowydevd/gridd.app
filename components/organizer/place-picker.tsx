"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Gps01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DARK_MAP_STYLE, loadGoogleMaps } from "@/lib/google-maps"
import { UY_BOUNDS } from "@/lib/maps"
import { ui } from "@/lib/ui"
import { cn } from "@/lib/utils"

type Coords = { lat: number; lon: number }

/** Lo mismo que `INITIAL_REGION` en publish.tsx: Montevideo, sin pin hasta que se elige un lugar. */
const MONTEVIDEO = { lat: -34.88, lng: -56.16 }
const PLACE_ZOOM = 16
const UY_LITERAL = {
  north: UY_BOUNDS.maxLat,
  south: UY_BOUNDS.minLat,
  east: UY_BOUNDS.maxLon,
  west: UY_BOUNDS.minLon,
}

const round = (n: number) => Math.round(n * 1e6) / 1e6
const same = (a: Coords, b: google.maps.LatLng) => Math.abs(a.lat - b.lat()) < 1e-5 && Math.abs(a.lon - b.lng()) < 1e-5

type Suggestion = {
  id: string
  main: string
  secondary: string
  prediction: google.maps.places.PlacePrediction
}

/**
 * El mapa del paso "Dónde" (como el MapView de mobile/src/app/publish.tsx): el pin queda fijo en el
 * centro y se mueve el mapa, o se toca el lugar y el mapa va ahí. Arriba, un buscador de Google Places
 * limitado a Uruguay que reemplaza al geocoder del teléfono.
 *
 * `onUnavailable` avisa si Google no carga o rechaza la key, para volver a pegar un link.
 */
export function PlacePicker({
  apiKey,
  value,
  onChange,
  onPlaceName,
  onUnavailable,
}: {
  apiKey: string
  value: Coords | null
  onChange: (coords: Coords) => void
  onPlaceName: (name: string) => void
  onUnavailable: () => void
}) {
  const mapEl = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  // Hasta que la persona mueve o toca el mapa no hay lugar elegido: el centro inicial no cuenta.
  const touched = useRef(value !== null)
  const session = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const callbacks = useRef({ onChange, onPlaceName, onUnavailable })
  const [ready, setReady] = useState(false)
  const [picked, setPicked] = useState(value !== null)

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [active, setActive] = useState(-1)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const listId = useId()

  useEffect(() => {
    callbacks.current = { onChange, onPlaceName, onUnavailable }
  })

  // El mapa se crea una vez; los cambios de `value` desde afuera se aplican en el efecto de abajo.
  const initial = useRef(value)
  useEffect(() => {
    let cancelled = false
    const listeners: google.maps.MapsEventListener[] = []
    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapEl.current) return
        const start = initial.current
        const m = new maps.Map(mapEl.current, {
          center: start ? { lat: start.lat, lng: start.lon } : MONTEVIDEO,
          zoom: start ? PLACE_ZOOM : 12,
          styles: DARK_MAP_STYLE,
          backgroundColor: "#111214",
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "greedy",
          restriction: { latLngBounds: UY_LITERAL, strictBounds: false },
        })
        const touch = () => {
          touched.current = true
          setPicked(true)
        }
        listeners.push(
          m.addListener("dragstart", touch),
          m.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return
            touch()
            m.panTo(e.latLng)
          }),
          m.addListener("idle", () => {
            const c = m.getCenter()
            if (touched.current && c)
              callbacks.current.onChange({
                lat: round(c.lat()),
                lon: round(c.lng()),
              })
          })
        )
        map.current = m
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onUnavailable()
      })
    return () => {
      cancelled = true
      listeners.forEach((l) => l.remove())
    }
  }, [apiKey])

  // Un lugar que llega de afuera (link pegado, buscador): el mapa va hasta ahí.
  useEffect(() => {
    const m = map.current
    const c = m?.getCenter()
    if (!m || !c || !value || same(value, c)) return
    touched.current = true
    setPicked(true)
    m.panTo({ lat: value.lat, lng: value.lon })
    if ((m.getZoom() ?? 0) < PLACE_ZOOM - 2) m.setZoom(PLACE_ZOOM)
  }, [value, ready])

  // Sugerencias mientras se escribe, con una pausa corta para no pedir una por tecla.
  useEffect(() => {
    const text = query.trim()
    if (!ready || text.length < 3) return
    let stale = false
    const timer = setTimeout(async () => {
      const { AutocompleteSessionToken, AutocompleteSuggestion } = google.maps.places
      session.current ??= new AutocompleteSessionToken()
      try {
        const { suggestions: found } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: text,
          sessionToken: session.current,
          includedRegionCodes: ["uy"],
          locationRestriction: UY_LITERAL,
          language: "es",
          region: "uy",
        })
        if (stale) return
        setSearchError(null)
        setActive(-1)
        setSuggestions(
          found.flatMap((s) => {
            const p = s.placePrediction
            if (!p) return []
            return [
              {
                id: p.placeId,
                main: p.mainText?.text ?? p.text.text,
                secondary: p.secondaryText?.text ?? "",
                prediction: p,
              },
            ]
          })
        )
      } catch {
        if (!stale) setSearchError("No pudimos buscar ahora. Mové el mapa hasta el lugar.")
      }
    }, 250)
    return () => {
      stale = true
      clearTimeout(timer)
    }
  }, [query, ready])

  const choose = async (s: Suggestion) => {
    setSuggestions([])
    setQuery(s.main)
    try {
      const place = s.prediction.toPlace()
      await place.fetchFields({ fields: ["location", "displayName"] })
      session.current = null // la sesión de Places termina al pedir el detalle
      const loc = place.location
      if (!loc) throw new Error("sin ubicación")
      callbacks.current.onChange({
        lat: round(loc.lat()),
        lon: round(loc.lng()),
      })
      if (place.displayName) callbacks.current.onPlaceName(place.displayName)
    } catch {
      setSearchError("No pudimos ubicar ese lugar. Probá con otro o mové el mapa.")
    }
  }

  const locate = () => {
    if (!navigator.geolocation || locating) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false)
        callbacks.current.onChange({
          lat: round(coords.latitude),
          lon: round(coords.longitude),
        })
      },
      () => {
        setLocating(false)
        setSearchError("No pudimos saber dónde estás. Buscá el lugar o mové el mapa.")
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  }

  const open = suggestions.length > 0

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={1.8}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          role="combobox"
          aria-label="Buscar dirección o lugar"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={query}
          disabled={!ready}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.trim().length < 3) setSuggestions([])
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && open) {
              e.preventDefault()
              setActive((i) => (i + 1) % suggestions.length)
            } else if (e.key === "ArrowUp" && open) {
              e.preventDefault()
              setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
            } else if (e.key === "Enter") {
              // Enter elige, no avanza de paso.
              e.preventDefault()
              const s = suggestions[active >= 0 ? active : 0]
              if (s) void choose(s)
            } else if (e.key === "Escape") {
              setSuggestions([])
            }
          }}
          placeholder="Buscá una dirección o un lugar"
          className={cn(ui.input, "pl-11")}
        />
        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-full z-20 mt-2 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          >
            {suggestions.map((s, i) => (
              <li
                key={s.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // mousedown para que el input no pierda el foco antes de elegir.
                onMouseDown={(e) => {
                  e.preventDefault()
                  void choose(s)
                }}
                className={cn(
                  "flex cursor-pointer flex-col px-4 py-3 text-left",
                  i === active ? "bg-input/40" : "hover:bg-input/30"
                )}
              >
                <span className="truncate text-sm font-medium">{s.main}</span>
                {s.secondary && <span className="truncate text-xs text-muted-foreground">{s.secondary}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {searchError && (
        <p role="alert" className={ui.error}>
          {searchError}
        </p>
      )}

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-[#111214]">
        <div ref={mapEl} className="absolute inset-0" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Cargando mapa…
          </div>
        )}
        {ready && (
          <>
            {/* El pin no es un marcador: queda fijo y lo que se mueve es el mapa. La punta marca el centro. */}
            <svg
              aria-hidden
              viewBox="0 0 24 32"
              className={cn(
                "pointer-events-none absolute top-1/2 left-1/2 h-10 w-8 -translate-x-1/2 -translate-y-full drop-shadow-lg transition-opacity",
                picked ? "opacity-100" : "opacity-40"
              )}
            >
              <path
                d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0Z"
                fill="var(--brand)"
              />
              <circle cx="12" cy="12" r="4.5" fill="#0B0B0C" />
            </svg>
            {!picked && (
              <p className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl bg-black/70 px-4 py-3 text-center text-sm text-white backdrop-blur-md">
                Mové el mapa hasta el lugar o tocalo
              </p>
            )}
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              aria-label="Usar mi ubicación"
              title="Usar mi ubicación"
              className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md outline-none hover:bg-black/75 focus-visible:ring-[3px] focus-visible:ring-brand/50 disabled:opacity-50"
            >
              <HugeiconsIcon icon={Gps01Icon} strokeWidth={1.8} className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
