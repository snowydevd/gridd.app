import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { CONTAINER } from "@/components/landing/section"
import { cn } from "@/lib/utils"

const links = [
  { href: "/eventos", label: "Eventos" },
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#garage", label: "Garage" },
  { href: "#organizadores", label: "Organizadores" },
  { href: "#preguntas", label: "Preguntas" },
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
      <div className={cn("flex h-16 items-center justify-between", CONTAINER)}>
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
          <nav aria-label="Secciones" className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span
            aria-disabled="true"
            className="cursor-not-allowed rounded-4xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground select-none"
          >
            Próximamente
          </span>
        </div>
      </div>
    </header>
  )
}

export { LandingNav }
