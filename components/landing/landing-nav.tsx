import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"

const links = [
  { href: "#app", label: "La app" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "/normas", label: "Normas" },
] as const

/**
 * Nav de la landing. Arranca transparente y sin contenido visible: durante
 * la cortina lo único que se ve es el logo grande en el medio.
 *
 * `#nav-logo-slot` es el destino del logo volador (ver intro-curtain). Guarda
 * el lugar con el wordmark real puesto en `visibility: hidden`, así el hueco
 * mide exactamente lo mismo que lo que va a aterrizar ahí.
 */
function LandingNav() {
  return (
    <header
      id="landing-nav"
      data-docked="false"
      className="landing-nav fixed inset-x-0 top-0 z-50 border-b border-transparent"
    >
      <div className="flex h-16 items-center justify-between px-8 sm:px-12 lg:px-16">
        <Link
          href="/"
          aria-label="Gridd — inicio"
          className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span id="nav-logo-slot" className="nav-logo-slot block">
            <Wordmark className="h-4 w-auto text-foreground" />
          </span>
        </Link>

        <div className="landing-nav-tail flex items-center gap-1 sm:gap-6">
          <nav aria-label="Secciones" className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#descargar"
            className="rounded-4xl bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors outline-none hover:bg-[color-mix(in_oklch,var(--brand),white_12%)] focus-visible:ring-[3px] focus-visible:ring-brand/40"
          >
            Descargar
          </Link>
        </div>
      </div>
    </header>
  )
}

export { LandingNav }
