import type { Metadata } from "next"
import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { SiteFooter } from "@/components/site-footer"
import { TestersForm } from "@/components/testers/testers-form"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Probá Gridd antes que nadie",
  description: "Anotate a la beta de Gridd: primero una prueba cerrada en Android y después una abierta.",
  path: "/testers",
})

// Anotarse a la beta. Primero una prueba cerrada en Google Play (Android) y después una abierta;
// los mails se guardan en Convex (`betaTesters`) y se contactan a mano.
export default function TestersPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-14 items-center px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Gridd — inicio"
          className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Wordmark className="h-3.5 text-foreground" />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 pt-6 pb-16">
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">Beta</span>
          <h1 className="text-[clamp(2rem,8vw,2.75rem)] leading-[1.02] tracking-[-0.02em] uppercase">
            Probá Gridd antes que nadie
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Primero abrimos una <strong className="text-foreground">prueba cerrada en Android</strong>, por Google
            Play, y después una <strong className="text-foreground">abierta</strong>. Dejanos tu mail y te avisamos en
            cada etapa.
          </p>
        </div>

        <TestersForm instagram={site.instagram} />
      </main>
      <SiteFooter />
    </div>
  )
}
