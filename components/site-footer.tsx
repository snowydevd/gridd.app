import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { legalNav } from "@/lib/legal"
import { site } from "@/lib/site"

/**
 * Pie del shell. Es la única entrada permanente a las páginas legales,
 * así que va en todas las vistas de la app.
 * El `pb` extra deja pasar la nav inferior fija en mobile.
 */
function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 pt-8 pb-28 sm:px-8 md:pb-10 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Wordmark className="h-3 self-start text-muted-foreground" />
            <p className="max-w-xs text-xs leading-5 text-muted-foreground">
              Encuentros fierreros, en un solo lugar. Gridd publica eventos, no
              los organiza.
            </p>
          </div>

          <nav
            aria-label="Legal"
            className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end"
          >
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs tracking-[0.06em] text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-xs text-muted-foreground/70">
          Nada de picadas ni carreras en la vía pública.{" "}
          <Link
            href="/normas"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Las normas
          </Link>
          . · © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}

export { SiteFooter }
