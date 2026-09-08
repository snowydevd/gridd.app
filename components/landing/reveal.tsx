"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Aparición al entrar en viewport. El estado oculto lo pone el CSS sólo
 * cuando `html` tiene `.js-anim` (ver globals.css), así sin JS o con
 * `prefers-reduced-motion` el contenido queda visible desde el principio.
 */
function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode
  /** Escalonado en ms. Sirve para que una fila no aparezca toda de golpe. */
  delay?: number
  className?: string
  as?: "div" | "section" | "li" | "p" | "span"
}) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // Avisa al failsafe del script inline que React llegó.
    document.documentElement.dataset.hydrated = "true"

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.revealed = "true"
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.revealed = "true"
        io.disconnect()
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}

export { Reveal }
