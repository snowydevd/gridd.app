"use client"

import * as React from "react"

import { Wordmark } from "@/components/brand/wordmark"
import { GridLines } from "@/components/landing/grid-lines"

/** Respiro con el logo grande quieto antes de que arranque el viaje. */
const HOLD = 400
/** Lo que dura el viaje en sí. Con el respiro, 2.2s de punta a punta. */
const TRAVEL = 1800
/** Al saltear no cortamos de golpe: el tramo que falta se resuelve en esto. */
const SKIP = 260

/** Teclas que en una página normal scrollearían: valen como "sacá esto". */
const SKIP_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "End",
  "Home",
  "Escape",
])

const FLUOR = [223, 255, 0] as const
const FOREGROUND = [242, 243, 245] as const

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** Arranca y termina suave: sin esto el logo salta con el primer frame. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * `useLayoutEffect` no existe en el server y React avisa si lo llamás ahí.
 * En el server no hay nada que reponer, así que cae a `useEffect` y listo.
 */
const useBeforePaint =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * Cortina de entrada: pantalla completa gris con el wordmark en el medio que,
 * después de un respiro, viaja solo hasta su lugar en la nav.
 *
 * Se mide el rectángulo de origen (el logo grande, centrado y fijo) y el de
 * destino (`#nav-logo-slot`, también fijo). Los dos son estables respecto del
 * viewport, así que alcanza con medirlos una vez y por resize: en cada frame
 * sólo se interpola centro, escala y color.
 *
 * Corre en cada carga de la landing. El estado vive en `data-intro` sobre el
 * `<html>`, que pone el script inline antes de pintar: "play" mientras corre,
 * "done" cuando aterrizó, "skip" sólo si el failsafe se rindió esperando a que
 * React hidrate. Sin JS o con `prefers-reduced-motion` no hay atributo y queda
 * una portada estática con el logo centrado, que es una página perfectamente
 * válida.
 */
function IntroCurtain() {
  const flierRef = React.useRef<HTMLDivElement>(null)
  const curtainRef = React.useRef<HTMLDivElement>(null)

  useBeforePaint(() => {
    if (prefersReducedMotion()) return

    const root = document.documentElement

    // En una carga normal el script inline ya dejó `data-intro` puesto antes de
    // pintar y esto no hace nada. Cubre los dos casos en que el atributo falta:
    // el remount de Strict Mode en dev, que resetea los atributos del <html> a
    // los que maneja el JSX, y la navegación cliente de vuelta a la landing,
    // donde el script inline no se re-ejecuta.
    //
    // Si el failsafe del script se rindió, el atributo está en "skip" y no lo
    // tocamos: la página ya se acomodó sin cortina.
    if (!root.dataset.intro) {
      root.classList.add("js-anim")
      root.dataset.intro = "play"
    }

    // Esto sí corre siempre: irse de la landing con la intro a medio camino
    // se llevaría el `overflow: hidden` puesto a la página siguiente.
    return () => {
      delete root.dataset.intro
    }
  }, [])

  React.useEffect(() => {
    const flier = flierRef.current
    const curtain = curtainRef.current
    if (!flier || !curtain) return

    const root = document.documentElement
    if (root.dataset.intro !== "play") return

    const nav = document.getElementById("landing-nav")
    let from: DOMRect | null = null
    let to: DOMRect | null = null
    let frame = 0
    let start = 0
    let progress = 0
    // Null mientras nadie pidió saltear; si no, desde qué progreso arrancó.
    let skipFrom: number | null = null
    let skipStart = 0

    const measure = () => {
      // El origen se mide sin transformar, si no leeríamos el rect ya movido.
      flier.style.transform = "none"
      from = flier.getBoundingClientRect()
      to = document.getElementById("nav-logo-slot")?.getBoundingClientRect() ?? null
    }

    const paint = (p: number) => {
      if (!from || !to || from.height === 0) return

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

    const tick = (now: number) => {
      if (!start) start = now

      progress =
        skipFrom === null
          ? clamp01((now - start - HOLD) / TRAVEL)
          : skipFrom + (1 - skipFrom) * clamp01((now - skipStart) / SKIP)

      paint(progress)

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
        return
      }

      frame = 0
      // Suelta el scroll y deja el logo haciendo de logo de la nav.
      root.dataset.intro = "done"
      detachSkip()
    }

    // No cortamos en seco: re-anclamos el progreso para que lo que falta se
    // resuelva en SKIP ms y el corte se vea continuo.
    const requestSkip = () => {
      if (skipFrom !== null || progress >= 1) return
      skipFrom = progress
      skipStart = performance.now()
    }

    const onSkip = (event: Event) => {
      if (event.type === "keydown" && !SKIP_KEYS.has((event as KeyboardEvent).key)) {
        return
      }
      requestSkip()
    }

    const onResize = () => {
      measure()
      paint(progress)
    }

    const detachSkip = () => {
      window.removeEventListener("wheel", onSkip)
      window.removeEventListener("touchstart", onSkip)
      window.removeEventListener("keydown", onSkip)
    }

    measure()
    paint(0)

    frame = requestAnimationFrame(tick)
    window.addEventListener("resize", onResize)
    // El scroll ya está bloqueado por CSS, así que el gesto sólo tiene que
    // avisarnos: no hace falta interceptarlo.
    window.addEventListener("wheel", onSkip, { passive: true })
    window.addEventListener("touchstart", onSkip, { passive: true })
    window.addEventListener("keydown", onSkip)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      detachSkip()
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
