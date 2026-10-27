import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { legalNav } from "@/lib/legal"
import { site } from "@/lib/site"

/** Pie de las páginas legales, con los links entre ellas. */
function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:px-8 md:py-10 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Wordmark className="h-3 self-start text-muted-foreground" />
            <p className="max-w-xs text-xs leading-5 text-muted-foreground">
              Encuentros fierreros, en un solo lugar. Gridd publica eventos, no
              los organiza.
            </p>
            <Link
              href="/testers"
              className="self-start text-xs font-medium text-foreground underline underline-offset-4 outline-none hover:text-brand focus-visible:text-brand"
            >
              Probá la app antes: sumate a la beta
            </Link>
          </div>

          <nav
            aria-label="Legal"
            className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end"
          >
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
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
