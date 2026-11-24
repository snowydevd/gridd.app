"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import { text } from "@/components/app/ui"
import type { AdsConfig } from "@/lib/ads"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const AdsContext = createContext<AdsConfig | null>(null)

/** La configuración viene del server (variables del Worker) y la leen los lugares de anuncio. */
export function AdsProvider({ config, children }: { config: AdsConfig; children: React.ReactNode }) {
  return <AdsContext.Provider value={config}>{children}</AdsContext.Provider>
}

function useAdsConfig() {
  const config = useContext(AdsContext)
  return config?.enabled ? config : null
}

/** Si en este tiempo AdSense no llenó el lugar (bloqueador, script caído), se esconde. */
const FILL_TIMEOUT_MS = 6000

/**
 * Una unidad de AdSense. `adsbygoogle.push` llena el `<ins>` (el script está en el layout). AdSense
 * le pone `data-ad-status="filled" | "unfilled"`: con eso se muestra la etiqueta o se esconde el
 * lugar entero, así no quedan cajas vacías con "Publicidad", como en la app. Si nunca lo marca
 * (bloqueador de anuncios), `onEmpty` a los FILL_TIMEOUT_MS.
 */
function AdUnit({
  config,
  slot,
  className,
  onEmpty,
  ...data
}: {
  config: AdsConfig
  slot: string
  className?: string
  onEmpty: () => void
  "data-ad-format"?: string
  "data-ad-layout-key"?: string
  "data-full-width-responsive"?: string
}) {
  const ref = useRef<HTMLModElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // En desarrollo React monta dos veces: AdSense falla si el `<ins>` ya tiene anuncio.
    if (!el.dataset.adsbygoogleStatus) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {
        onEmpty()
        return
      }
    }
    const timer = window.setTimeout(() => {
      if (el.dataset.adStatus !== "filled") onEmpty()
    }, FILL_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [onEmpty])
  return (
    <ins
      ref={ref}
      className={cn("adsbygoogle block", className)}
      data-ad-client={config.client}
      data-ad-slot={slot}
      data-adtest={config.test ? "on" : undefined}
      {...data}
    />
  )
}

const unfilledHidden = "has-[ins[data-ad-status=unfilled]]:hidden"
const labelUntilFilled = "opacity-0 group-has-[ins[data-ad-status=filled]]:opacity-100"

/**
 * El banner de arriba (TopBanner de la app): fijo al scrollear y de alto fijo, así el contenido no
 * salta cuando llega el anuncio. "Publicidad" se ve recién con un anuncio cargado.
 */
export function TopBanner() {
  const config = useAdsConfig()
  const [empty, setEmpty] = useState(false)
  // Estable: si cambiara en cada render, el efecto de AdUnit volvería a correr.
  const onEmpty = useCallback(() => setEmpty(true), [])
  if (!config?.bannerSlot || empty) return null
  return (
    <aside
      aria-label="Publicidad"
      className={cn(
        "group sticky top-0 z-20 border-b border-border bg-background pt-[env(safe-area-inset-top)] pb-1",
        unfilledHidden
      )}
    >
      <p className={cn(text.overline, labelUntilFilled, "mx-auto w-full max-w-xl px-4 pt-1 text-muted-foreground")}>
        Publicidad
      </p>
      <div className="mx-auto flex h-[50px] w-full max-w-xl items-center justify-center overflow-hidden">
        <AdUnit
          config={config}
          slot={config.bannerSlot}
          onEmpty={onEmpty}
          className="h-[50px] w-full max-w-[320px]"
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        />
      </div>
    </aside>
  )
}

/**
 * La tarjeta de anuncio entre eventos (NativeAdCard de la app): `row` en las listas, `wide` a todo el
 * ancho de una grilla y `tile` en una columna de la grilla de flyers. Es la unidad in-feed de AdSense, que se adapta al ancho.
 */
export function FeedAd({ variant }: { variant: "row" | "wide" | "tile" }) {
  const config = useAdsConfig()
  const [empty, setEmpty] = useState(false)
  // Estable: si cambiara en cada render, el efecto de AdUnit volvería a correr.
  const onEmpty = useCallback(() => setEmpty(true), [])
  if (!config?.feedSlot || empty) return null
  return (
    <aside
      aria-label="Publicidad"
      className={cn(
        "group overflow-hidden",
        variant === "wide"
          ? "col-span-2 rounded-[16px] border border-border p-3"
          : variant === "tile"
            ? "rounded-[16px] border border-border p-2"
            : "rounded-[12px] py-2",
        unfilledHidden
      )}
    >
      <p className={cn(text.overline, labelUntilFilled, "mb-1 text-muted-foreground")}>Publicidad</p>
      <AdUnit
        config={config}
        slot={config.feedSlot}
        onEmpty={onEmpty}
        className={variant === "row" ? "min-h-[72px]" : "min-h-[120px]"}
        data-ad-format="fluid"
        data-ad-layout-key={config.feedLayoutKey}
      />
    </aside>
  )
}
