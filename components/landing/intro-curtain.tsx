"use client"

import * as React from "react"

import { Wordmark } from "@/components/brand/wordmark"
import { GridLines } from "@/components/landing/grid-lines"

/** El logo termina de acoplarse a los ~50vh de scroll: un gesto, no tres. */
const TRAVEL_MIN = 300
const TRAVEL_MAX = 560

const FLUOR = [223, 255, 0] as const
const FOREGROUND = [242, 243, 245] as const

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** Arranca y termina suave: sin esto el logo salta con el primer píxel. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Cortina de entrada: pantalla completa gris con el wordmark en el medio que,
 * al primer scroll, viaja hasta su lugar en la nav.
 *
 * Se mide el rectángulo de origen (el logo grande, centrado y fijo) y el de
 * destino (`#nav-logo-slot`, también fijo). Los dos son estables respecto del
 * viewport, así que alcanza con medirlos una vez y por resize: en cada frame
 * sólo se interpola centro, escala y color.
 *
 * Sin JS o con `prefers-reduced-motion` nada de esto corre y queda una portada
 * estática con el logo centrado, que es una página perfectamente válida.
 */
function IntroCurtain() {
  const flierRef = React.useRef<HTMLDivElement>(null)
  const curtainRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const flier = flierRef.current
    const curtain = curtainRef.current
    if (!flier || !curtain) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const root = document.documentElement
    root.classList.add("js-intro")

    const nav = document.getElementById("landing-nav")
    let from: DOMRect | null = null
    let to: DOMRect | null = null
    let travel = TRAVEL_MIN
    let frame = 0

    function measure() {
      if (!flier) return
      // El origen se mide sin transformar, si no leeríamos el rect ya movido.
      flier.style.transform = "none"
      from = flier.getBoundingClientRect()
      to = document.getElementById("nav-logo-slot")?.getBoundingClientRect() ?? null
      travel = Math.min(Math.max(window.innerHeight * 0.5, TRAVEL_MIN), TRAVEL_MAX)
    }

    function render() {
      frame = 0
      if (!flier || !curtain || !from || !to || from.height === 0) return

      const p = clamp01(window.scrollY / travel)
      const e = easeInOutCubic(p)

      const scale = lerp(1, to.height / from.height, e)
      const dx = lerp(0, to.left + to.width / 2 - (from.left + from.width / 2), e)
      const dy = lerp(0, to.top + to.height / 2 - (from.top + from.height / 2), e)

      flier.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`
      flier.style.color = `rgb(${FLUOR.map((c, i) =>
        Math.round(lerp(c, FOREGROUND[i], e))
      ).join(" ")})`

      // El gris aguanta un poco antes de irse, para que el viaje se vea.
      curtain.style.opacity = String(1 - clamp01((p - 0.1) / 0.7))
      curtain.style.visibility = p >= 1 ? "hidden" : "visible"

      nav?.setAttribute("data-docked", p > 0.55 ? "true" : "false")
    }

    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(render)
    }

    function onResize() {
      measure()
      render()
    }

    measure()
    render()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      if (frame) cancelAnimationFrame(frame)
      root.classList.remove("js-intro")
      nav?.setAttribute("data-docked", "false")
    }
  }, [])

  return (
    <section
      aria-label="Gridd"
      className="intro-runway relative min-h-[100svh] w-full"
    >
      <div
        ref={curtainRef}
        className="intro-curtain pointer-events-none absolute inset-0 z-40 bg-muted"
      >
        <GridLines />
        <p className="intro-hint absolute inset-x-0 bottom-8 text-center font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase">
          Scrolleá
        </p>
      </div>

      {/* El logo va fuera de la cortina: si fuera hijo heredaría su opacidad
          y se desvanecería antes de llegar a la nav. */}
      <div className="intro-flier-layer pointer-events-none absolute inset-0 z-[51] flex items-center justify-center">
        <div
          ref={flierRef}
          className="intro-flier will-change-transform text-brand"
        >
          <Wordmark className="h-[clamp(3.25rem,17vw,9rem)] w-auto" />
        </div>
      </div>
    </section>
  )
}

export { IntroCurtain }
