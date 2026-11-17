"use client"

import { useSyncExternalStore } from "react"

/**
 * El tema que se ve ahora ("light" o "dark"): el fijado en Cuenta → Apariencia (`data-theme` en
 * <html>) o, si no, el del teléfono. Lo usan el mapa (estilo y pines) y lo que no hereda del CSS.
 */
export type Scheme = "light" | "dark"

function resolve(): Scheme {
  const fixed = document.documentElement.getAttribute("data-theme")
  if (fixed === "light" || fixed === "dark") return fixed
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

function subscribe(listener: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)")
  media.addEventListener("change", listener)
  const observer = new MutationObserver(listener)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
  return () => {
    media.removeEventListener("change", listener)
    observer.disconnect()
  }
}

export function useScheme(): Scheme {
  return useSyncExternalStore(subscribe, resolve, () => "dark")
}
