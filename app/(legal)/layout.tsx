import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { SiteFooter } from "@/components/site-footer"

/**
 * Shell de las páginas legales: header con el wordmark y la vuelta a la
 * landing, el texto y el pie con los links legales.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Gridd — inicio"
            className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Wordmark className="h-3.5 text-foreground" />
          </Link>
          <Link
            href="/#descargar"
            className="rounded-4xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors outline-none hover:bg-[color-mix(in_oklch,var(--brand),white_12%)] focus-visible:ring-[3px] focus-visible:ring-brand/40"
          >
            Descargar
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pt-8 pb-16 sm:px-8 lg:px-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
