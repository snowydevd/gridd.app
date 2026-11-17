"use client"

import { useSyncExternalStore } from "react"

/**
 * Ubicación del usuario, como `useLastKnownLocation` en la app: sólo si ya dio permiso. No lo pide
 * (eso lo hace el botón "Centrar en mi ubicación" del mapa, con `requestLocation`). `null` mientras
 * tanto o sin permiso. Un solo pedido por página, compartido por todos los componentes.
 */
export type Coords = { lat: number; lon: number }

let current: Coords | null = null
let started = false
const listeners = new Set<() => void>()

function set(coords: Coords) {
  current = coords
  listeners.forEach((l) => l())
}

function read(options: PositionOptions): Promise<Coords> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      reject,
      options
    )
  )
}

function start() {
  if (started || typeof navigator === "undefined" || !navigator.geolocation) return
  started = true
  // Safari no tiene `permissions.query` para geolocation en versiones viejas: ahí no se pregunta.
  navigator.permissions
    ?.query({ name: "geolocation" as PermissionName })
    .then((status) => {
      if (status.state === "granted") return read({ maximumAge: 10 * 60 * 1000, timeout: 10_000 }).then(set)
    })
    .catch(() => {
      // Sin permiso o sin GPS: Inicio funciona igual, sin distancias.
    })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  start()
  return () => listeners.delete(listener)
}

export function useKnownLocation(): Coords | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null
  )
}

/** Pide permiso (si hace falta) y la ubicación actual. Tira si no hay permiso o GPS. */
export async function requestLocation(): Promise<Coords> {
  if (!navigator.geolocation) throw new Error("sin geolocalización")
  const coords = await read({ enableHighAccuracy: false, maximumAge: 60 * 1000, timeout: 15_000 })
  set(coords)
  return coords
}
