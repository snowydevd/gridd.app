import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { CONTAINER, EYEBROW } from "@/components/landing/section"
import { legalNav } from "@/lib/legal"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const appNav = [
  { href: "/eventos", label: "Próximos encuentros" },
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#garage", label: "Garage" },
  { href: "#organizadores", label: "Organizadores" },
  { href: "#preguntas", label: "Preguntas" },
] as const

const LINK =
  "text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"

/** Pie de la landing: marca, secciones, legales y contacto. */
function LandingFooter() {
  return (
    <footer className="relative border-t border-border">
      <div className={cn("relative flex flex-col gap-12 py-14", CONTAINER)}>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <Wordmark className="h-4 self-start text-foreground" />
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Los encuentros fierreros de Uruguay, en un solo lugar. Gridd
              publica eventos, no los organiza.
            </p>
          </div>

          <nav aria-label="La app" className="flex flex-col gap-3">
            <p className={EYEBROW}>La app</p>
            {appNav.map((item) => (
              <Link key={item.href} href={item.href} className={LINK}>
                {item.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Legal" className="flex flex-col gap-3">
            <p className={EYEBROW}>Legal</p>
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className={LINK}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="col-span-2 flex flex-col gap-3 lg:col-span-1">
            <p className={EYEBROW}>Contacto</p>
            <a href={`mailto:${site.emails.hola}`} className={LINK}>
              {site.emails.hola}
            </a>
            <p className="max-w-[16rem] text-sm leading-6 text-muted-foreground">
              Soporte, bajas, moderación y organizadores tienen su casilla en{" "}
              <Link href="/contacto" className={LINK}>
                contacto
              </Link>
              . Lo lee una persona.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 text-[0.72rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 · {site.name}</span>
          <span>Nada de picadas ni carreras en la vía pública</span>
          <span>gridd.app</span>
        </div>
      </div>
    </footer>
  )
}

export { LandingFooter }
