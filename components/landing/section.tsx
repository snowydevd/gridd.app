import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { GridLines } from "@/components/landing/grid-lines"
import { Reveal } from "@/components/landing/reveal"
import { cn } from "@/lib/utils"

/** Ancho y márgenes del contenido de la landing. La retícula usa los mismos. */
const CONTAINER = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12"

const EYEBROW = "text-[0.72rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase"

const H2 = "text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.02] tracking-[-0.02em] text-balance"

/** Sección de la landing: borde arriba, retícula de fondo y el contenido centrado. */
function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-16 border-t border-border py-16 sm:py-20", className)}
    >
      <GridLines />
      <div className={cn("relative", CONTAINER)}>{children}</div>
    </section>
  )
}

/**
 * Encabezado de sección. En desktop el título va a la izquierda y la bajada a
 * la derecha, así no queda una columna angosta con media pantalla vacía.
 */
function SectionHeader({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16",
        className
      )}
    >
      <div className="flex max-w-2xl flex-col gap-4">
        <Reveal>
          <p className={EYEBROW}>{eyebrow}</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className={H2}>{title}</h2>
        </Reveal>
      </div>
      {children ? (
        <Reveal delay={160} className="max-w-md text-sm leading-7 text-muted-foreground">
          {children}
        </Reveal>
      ) : null}
    </div>
  )
}

/** Ícono en un cuadradito, como los de las tarjetas de la app. */
function IconTile({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-2xl bg-muted text-brand",
        className
      )}
    >
      <HugeiconsIcon icon={icon} strokeWidth={1.8} aria-hidden className="size-5" />
    </span>
  )
}

export { CONTAINER, EYEBROW, H2, IconTile, Section, SectionHeader }
